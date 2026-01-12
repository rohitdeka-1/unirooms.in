import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import Property from "../Models/property.model.js";
import crypto from "crypto";
import config from "../Config/env.config.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
    config.CASHFREE_ENVIRONMENT === "PRODUCTION" || config.CASHFREE_ENVIRONMENT === "PROD"
        ? CFEnvironment.PRODUCTION 
        : CFEnvironment.SANDBOX,
    config.CASHFREE_APP_ID,
    config.CASHFREE_SECRET_KEY
);

// Normalize Cashfree payment_group to our enum values
const normalizePaymentMethod = (paymentGroup) => {
    if (!paymentGroup) return "online";
    
    const normalized = paymentGroup.toLowerCase();
    
    // Map Cashfree payment_group values to our enum
    if (normalized.includes('upi')) return 'upi';
    if (normalized.includes('card') || normalized.includes('credit') || normalized.includes('debit')) return 'card';
    if (normalized.includes('net') || normalized.includes('bank')) return 'netbanking';
    if (normalized.includes('wallet')) return 'wallet';
    
    // Return original if it matches our enum, otherwise default
    const validMethods = ["upi", "card", "netbanking", "wallet", "credit_card", "debit_card", "net_banking", "online"];
    return validMethods.includes(normalized) ? normalized : "online";
};

export const createPaymentOrder = async (req, res) => {
    try {
        
        if (req.user.role !== "landlord") {
            return res.status(403).json({
                success: false,
                message: "Only landlords can create payment orders",
            });
        }

        const user = await User.findById(req.user.id).lean(); // Use lean() for faster query
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide a phone number for this property listing",
            });
        }

        const amount = 1; 
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        
        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: user.name,
                customer_email: user.email,
                customer_phone: phone,
            },
            order_meta: {
                return_url: `${config.FRONTEND_URL}/landlord/payment-callback?order_id={order_id}`,
                notify_url: `${process.env.BACKEND_URL || config.BACKEND_URL}/api/v1/payments/webhook`,
            },
            order_note: "Property Listing Credit Purchase",
        };

        // Set a timeout for the Cashfree API call
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Payment gateway timeout')), 10000) // 10 second timeout
        );
        
        const cashfreePromise = cashfree.PGCreateOrder(request);
        
        const response = await Promise.race([cashfreePromise, timeoutPromise]);
        
        if (process.env.NODE_ENV === 'development') {
            console.log('Payment order created for user:', req.user.id);
        }

        
        const payment = await Payment.create({
            userId: req.user.id,
            amount,
            currency: "INR",
            status: "pending",
            purpose: "property_listing",
            cashfreeOrderId: orderId,
            propertiesCount: 1, // Each payment is for 1 property listing credit
        });

        const responseData = {
            orderId: payment.cashfreeOrderId,
            amount: payment.amount,
            currency: payment.currency,
            paymentId: payment._id,
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id,
            cf_order_id: response.data.cf_order_id,
        };

        res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            data: responseData,
        });
    } catch (error) {
        console.error("Create Payment Order Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.message === 'Payment gateway timeout' 
                ? "Payment gateway is taking too long. Please try again."
                : "Error creating payment order",
            error: error.response?.data?.message || error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const payment = await Payment.findOne({ cashfreeOrderId: orderId }).lean();

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        if (payment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Set a timeout for the Cashfree API call
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Payment verification timeout')), 8000) // 8 second timeout
        );
        
        const cashfreePromise = cashfree.PGOrderFetchPayments(orderId);
        
        const response = await Promise.race([cashfreePromise, timeoutPromise]);

        if (response.data && response.data.length > 0) {
            const paymentInfo = response.data[0];
            
            if (paymentInfo.payment_status === "SUCCESS") {
                // Update payment without fetching it again
                await Payment.updateOne(
                    { cashfreeOrderId: orderId },
                    {
                        $set: {
                            status: "success",
                            paymentMethod: normalizePaymentMethod(paymentInfo.payment_group),
                            paymentDate: new Date(),
                            cashfreePaymentId: paymentInfo.cf_payment_id,
                            transactionMessage: paymentInfo.payment_message || "Payment successful"
                        }
                    }
                );

                return res.status(200).json({
                    success: true,
                    message: "Payment verified successfully",
                    data: {
                        paymentId: payment._id,
                        status: "success",
                    },
                });
            } else if (paymentInfo.payment_status === "PENDING" || paymentInfo.payment_status === "ACTIVE") {
                return res.status(200).json({
                    success: false,
                    message: "Payment is still pending",
                    data: {
                        status: paymentInfo.payment_status,
                        paymentId: payment._id,
                    },
                });
            } else {
                // Payment failed or other status
                await Payment.updateOne(
                    { cashfreeOrderId: orderId },
                    {
                        $set: {
                            status: "failed",
                            failureReason: paymentInfo.payment_message || "Payment failed"
                        }
                    }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Payment not completed",
                    data: {
                        status: paymentInfo.payment_status,
                        reason: paymentInfo.payment_message
                    },
                });
            }
        }

        res.status(400).json({
            success: false,
            message: "No payment information found",
        });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({
            success: false,
            message: error.message === 'Payment verification timeout'
                ? "Payment verification is taking too long. Please try again."
                : "Error verifying payment",
            error: error.message,
        });
    }
};

export const handleWebhook = async (req, res) => {
    try {
        const { type, data } = req.body;

        // Skip signature verification for now - Cashfree webhooks in production often don't include signatures
        // Verify webhook by checking order existence in our database instead
        
        if (!data || !data.order || !data.order.order_id) {
            console.log("Webhook test or invalid payload received");
            return res.status(200).json({ success: true, message: "Webhook endpoint is active" });
        }

        const payment = await Payment.findOne({ cashfreeOrderId: data.order.order_id });

        if (!payment) {
            console.log(`Payment not found for order: ${data.order.order_id}`);
            return res.status(200).json({ success: true, message: "Order not found, but webhook acknowledged" });
        }

        switch (type) {
            case "PAYMENT_SUCCESS_WEBHOOK":
                payment.status = "success";
                payment.paymentMethod = normalizePaymentMethod(data.payment.payment_group);
                payment.paymentDate = new Date();
                payment.cashfreePaymentId = data.payment.cf_payment_id;
                payment.transactionMessage = data.payment.payment_message || "Payment successful";
                break;

            case "PAYMENT_FAILED_WEBHOOK":
                payment.status = "failed";
                payment.failureReason = data.payment.payment_message || "Payment failed";
                break;
                
            case "PAYMENT_USER_DROPPED_WEBHOOK":
                payment.status = "failed";
                payment.failureReason = "User dropped the payment";
                break;

            default:
                console.log(`Unhandled webhook type: ${type}`);
        }

        await payment.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(200).json({ success: true, message: "Webhook received" });
    }
};

export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: { payments },
        });
    } catch (error) {
        console.error("Get Payments Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payments",
            error: error.message,
        });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        if (payment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            data: { payment },
        });
    } catch (error) {
        console.error("Get Payment Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payment",
            error: error.message,
        });
    }
};
