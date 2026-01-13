import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentAPI } from '../utils/api';
import toast from 'react-hot-toast';

const DonationModal = ({ onClose }) => {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('select'); // select, processing, success, error
    const [donorName, setDonorName] = useState('');
    const [message, setMessage] = useState('');
    const [sdkReady, setSdkReady] = useState(false);

    const presetAmounts = [29, 49, 99, 199, 499];

     useEffect(() => {
        if (window.Cashfree) {
            setSdkReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleAmountSelect = (value) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        setAmount('custom');
    };

    const getSelectedAmount = () => {
        if (amount === 'custom') return parseInt(customAmount) || 0;
        return parseInt(amount) || 0;
    };

    const handleDonate = async () => {
        const finalAmount = getSelectedAmount();
        if (finalAmount < 5) {
            toast.error('Minimum donation amount is ₹5');
            return;
        }

        if (!sdkReady || !window.Cashfree) {
            toast.error('Payment system loading, please try again');
            return;
        }

        try {
            setLoading(true);
            setStep('processing');

            const orderRes = await paymentAPI.createDonation({ 
                amount: finalAmount,
                donorName: donorName || 'Anonymous',
                message: message
            });

            const { payment_session_id, order_id } = orderRes.data;

            const cashfree = window.Cashfree({
                mode: import.meta.env.VITE_CASHFREE_MODE || "production",
            });

            const checkoutOptions = {
                paymentSessionId: payment_session_id,
                redirectTarget: "_modal",
                appearance: {
                    theme: 'light'
                }
            };

            cashfree.checkout(checkoutOptions).then(async (result) => {
                if (result.error) {
                    console.error("Payment error:", result.error);
                    setStep('error');
                    setLoading(false);
                } else if (result.paymentDetails) {
                    await paymentAPI.verifyDonation({ orderId: order_id });
                    setStep('success');
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Donation error:', error);
            setStep('error');
            setLoading(false);
        }
    };

    const selectedAmount = getSelectedAmount();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {step === 'select' && (
                        <>
                            {/* Header with gradient */}
                            <div className="relative bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 p-6 text-white">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <span className="text-2xl">☕</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Support Unirooms</h2>
                                        <p className="text-white/80 text-sm">Buy us a coffee!</p>
                                    </div>
                                </div>
                                <p className="text-white/90 text-sm">
                                    Your support helps us keep the platform free and add new features for students! 💜
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Preset amounts */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-neutral-600 mb-3">
                                        Choose an amount
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setAmount('custom')}
                                            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                                amount === 'custom'
                                                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                        >
                                            Custom
                                        </button>
                                        {presetAmounts.map((preset) => (
                                            <button
                                                key={preset}
                                                onClick={() => handleAmountSelect(preset)}
                                                className={`relative py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                                    amount === preset
                                                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                            >
                                                ₹{preset}
                                                {preset === 49 && (
                                                    <span className="absolute -top-2 -right-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                                        Popular
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom amount input */}
                                <AnimatePresence>
                                    {amount === 'custom' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-5"
                                        >
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">₹</span>
                                                <input
                                                    type="text"
                                                    value={customAmount}
                                                    onChange={handleCustomAmountChange}
                                                    placeholder="Enter amount"
                                                    className="w-full pl-8 pr-4 py-3 bg-neutral-100 rounded-xl border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-lg font-semibold"
                                                    autoFocus
                                                />
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-1.5">Minimum ₹5</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Optional fields */}
                                <div className="space-y-3 mb-5">
                                    <input
                                        type="text"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        placeholder="Your name (optional)"
                                        className="w-full px-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-500 focus:bg-white outline-none transition-all text-sm"
                                    />
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Leave a message (optional)"
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-500 focus:bg-white outline-none transition-all text-sm resize-none"
                                    />
                                </div>

                                {/* Donate button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDonate}
                                    disabled={selectedAmount < 10}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                        selectedAmount >= 5
                                            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/50'
                                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span>☕</span>
                                    {selectedAmount >= 5 ? (
                                        <span>Donate ₹{selectedAmount}</span>
                                    ) : (
                                        <span>Select an amount</span>
                                    )}
                                </motion.button>

                                {/* Footer note */}
                                <p className="text-center text-xs text-neutral-400 mt-4">
                                    Secured by Cashfree Payments 🔒
                                </p>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-ping opacity-30"></div>
                                <div className="relative w-full h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-3xl animate-bounce">☕</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Processing...</h3>
                            <p className="text-neutral-500 text-sm">Please complete the payment</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                            >
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-2">Thank you! 💜</h3>
                            <p className="text-neutral-500 mb-6">Your support means the world to us!</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Payment Failed</h3>
                            <p className="text-neutral-500 mb-6">Something went wrong. Please try again.</p>
                            <button
                                onClick={() => setStep('select')}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DonationModal;
