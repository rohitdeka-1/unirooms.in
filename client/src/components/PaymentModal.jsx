import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentAPI } from '../utils/api';
const PaymentModal = ({ onClose, onSuccess, propertyPhone }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('confirm'); 
    const [paymentSessionId, setPaymentSessionId] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    const handlePayment = async () => {
        try {
            setLoading(true);
            setStep('processing');
            const orderRes = await paymentAPI.createOrder({ phone: propertyPhone });
            const { payment_session_id, order_id, paymentId: pId } = orderRes.data;
            setPaymentSessionId(payment_session_id);
            setOrderId(order_id);
            setPaymentId(pId);
            const cashfree = window.Cashfree({
                mode: import.meta.env.VITE_CASHFREE_MODE || "production", 
            });
            const checkoutOptions = {
                paymentSessionId: payment_session_id,
                redirectTarget: "_modal", 
                appearance: {
                    theme: 'light'
                },
                style: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }
            };
            cashfree.checkout(checkoutOptions).then((result) => {
                if (result.error) {
                    console.error("Payment error:", result.error);
                    setErrorMessage(result.error.message || 'Payment failed. Please try again.');
                    setStep('error');
                    setLoading(false);
                } else if (result.redirect) {
                    console.log("Payment redirect");
                } else if (result.paymentDetails) {
                    handlePaymentSuccess(order_id, pId);
                }
            });
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || 'Payment failed. Please try again.');
            setStep('error');
            setLoading(false);
        }
    };
    const handlePaymentSuccess = async (orderId, pId) => {
        try {
            await paymentAPI.verifyPayment({ orderId });
            setStep('success');
            setTimeout(() => {
                onSuccess(pId);
            }, 1500);
        } catch (error) {
            console.error('Verification error:', error);
            setErrorMessage('Payment verification failed. Please contact support.');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                >
                    {step === 'confirm' && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                    Payment Required
                                </h2>
                                <p className="text-neutral-600">
                                    One-time payment to list your property
                                </p>
                            </div>
                            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-700 font-medium">Property Listing Fee</span>
                                    <span className="text-2xl font-bold text-primary-600">₹99</span>
                                </div>
                                <p className="text-sm text-neutral-600">
                                    Your property will be listed for 6 months
                                </p>
                            </div>
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-800">
                                    <strong>Secure Payment:</strong> Powered by Cashfree - Accept UPI, Cards, Net Banking & Wallets
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Processing...' : 'Pay ₹99'}
                                </button>
                            </div>
                        </>
                    )}
                    {step === 'processing' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                                Processing Payment
                            </h3>
                            <p className="text-neutral-600">
                                Please wait while we process your payment...
                            </p>
                        </div>
                    )}
                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                                Payment Successful!
                            </h3>
                            <p className="text-neutral-600">
                                Creating your property listing...
                            </p>
                        </div>
                    )}
                    {step === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                                Payment Failed
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                {errorMessage}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('confirm');
                                        setErrorMessage('');
                                    }}
                                    className="btn-primary flex-1"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
export default PaymentModal;
