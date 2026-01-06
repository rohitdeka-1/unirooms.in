import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import crypto from "crypto";
import config from "../Config/env.config.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree SDK
// Constructor: new Cashfree(XEnvironment, XClientId, XClientSecret, ...)
const cashfree = new Cashfree(
    config.CASHFREE_ENVIRONMENT === "PRODUCTION" 
        ? CFEnvironment.PRODUCTION 
        : CFEnvironment.SANDBOX,
    config.CASHFREE_APP_ID,
    config.CASHFREE_SECRET_KEY
);

// @desc    Create payment order for property listing
// @route   POST /api/payments/create-order
// @access  Private (Landlord)
export const createPaymentOrder = async (req, res) => {
    try {
        // Check if user is landlord
        if (req.user.role !== "landlord") {
            return res.status(403).json({
                success: false,
                message: "Only landlords can create payment orders",
            });
        }

        const user = await User.findById(req.user.id);
        const amount = 99; // ₹99 per property listing
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create Cashfree order request
        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: user.name,
                customer_email: user.email,
                customer_phone: user.phone,
            },
            order_meta: {
                return_url: `${config.FRONTEND_URL}/landlord/payment-callback?order_id={order_id}`,
                notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/payments/webhook`,
            },
            order_note: "Property Listing Payment",
        };

        // Create order with Cashfree
        const response = await cashfree.PGCreateOrder(request);

        // Create payment record in database
        const payment = await Payment.create({
            userId: req.user.id,
            amount,
            currency: "INR",
            status: "pending",
            purpose: "property_listing",
            cashfreeOrderId: orderId,
        });

        res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            data: {
                orderId: payment.cashfreeOrderId,
                amount: payment.amount,
                currency: payment.currency,
                paymentId: payment._id,
                payment_session_id: response.data.payment_session_id,
                order_id: response.data.order_id,
            },
        });
    } catch (error) {
        console.error("Create Payment Order Error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating payment order",
            error: error.message,
        });
    }
};

// @desc    Verify payment with Cashfree
// @route   POST /api/payments/verify
// @access  Private (Landlord)
export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const payment = await Payment.findOne({ cashfreeOrderId: orderId });

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

        // Verify payment with Cashfree
        const response = await cashfree.PGOrderFetchPayments(orderId);

        if (response.data && response.data.length > 0) {
            const paymentInfo = response.data[0];
            
            if (paymentInfo.payment_status === "SUCCESS") {
                payment.status = "success";
                payment.paymentMethod = paymentInfo.payment_group || "online";
                payment.paymentDate = new Date();
                payment.cashfreePaymentId = paymentInfo.cf_payment_id;
                payment.transactionMessage = paymentInfo.payment_message || "Payment successful";
                
                await payment.save();

                return res.status(200).json({
                    success: true,
                    message: "Payment verified successfully",
                    data: {
                        paymentId: payment._id,
                        status: payment.status,
                    },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Payment not completed",
                    data: {
                        status: paymentInfo.payment_status,
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
            message: "Error verifying payment",
            error: error.message,
        });
    }
};

// @desc    Cashfree Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Cashfree)
export const handleWebhook = async (req, res) => {
    try {
        const { type, data } = req.body;

        // Verify webhook signature (recommended in production)
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];
        
        // Find payment by order ID
        const payment = await Payment.findOne({ cashfreeOrderId: data.order.order_id });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        // Handle different webhook events
        switch (type) {
            case "PAYMENT_SUCCESS_WEBHOOK":
                payment.status = "success";
                payment.paymentMethod = data.payment.payment_group || "online";
                payment.paymentDate = new Date();
                payment.cashfreePaymentId = data.payment.cf_payment_id;
                payment.transactionMessage = data.payment.payment_message || "Payment successful";
                break;

            case "PAYMENT_FAILED_WEBHOOK":
                payment.status = "failed";
                payment.failureReason = data.payment.payment_message || "Payment failed";
                break;

            default:
                console.log(`Unhandled webhook type: ${type}`);
        }

        await payment.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
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

// @desc    Get single payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Check ownership
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
