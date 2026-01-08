import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
const VerifyEmailPending = () => {
    const location = useLocation();
    const email = location.state?.email;
    const openGmail = () => {
        window.open('https://mail.google.com', '_blank');
    };
    const openOutlook = () => {
        window.open('https://outlook.live.com', '_blank');
    };
    const openYahoo = () => {
        window.open('https://mail.yahoo.com', '_blank');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                        <img src="/logo.png" alt="Unirooms" className="w-12 h-12 rounded-xl" />
                        <span className="text-2xl font-display font-bold text-neutral-800">Unirooms</span>
                    </Link>
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                        Verify Your Email
                    </h2>
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                        <p className="text-primary-800 font-medium mb-2">
                            We've sent a verification email to:
                        </p>
                        <p className="text-primary-900 font-bold text-lg">
                            {email || 'your email address'}
                        </p>
                    </div>
                    <p className="text-neutral-600 mb-6">
                        Please check your inbox and click the verification link to activate your account.
                    </p>
                    <div className="space-y-3 mb-8">
                        <p className="text-sm font-semibold text-neutral-700 mb-3">
                            Quick access to your email:
                        </p>
                        <button
                            onClick={openGmail}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5 5v14h14V5H5zm7 10.5L5 10V8l7 4.5L19 8v2l-7 5.5z"/>
                            </svg>
                            <span className="font-medium text-neutral-700">Open Gmail</span>
                        </button>
                        <button
                            onClick={openOutlook}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#0078D4" d="M7 4v16h10V4H7zm5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                            </svg>
                            <span className="font-medium text-neutral-700">Open Outlook</span>
                        </button>
                        <button
                            onClick={openYahoo}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#6001D2" d="M12 2L8 12h8L12 2zm0 20l4-10H8l4 10z"/>
                            </svg>
                            <span className="font-medium text-neutral-700">Open Yahoo Mail</span>
                        </button>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-neutral-600 mb-2">
                            <strong>Didn't receive the email?</strong>
                        </p>
                        <ul className="text-xs text-neutral-500 text-left space-y-1">
                            <li>• Check your spam or junk folder</li>
                            <li>• Make sure you entered the correct email</li>
                            <li>• Wait a few minutes and refresh your inbox</li>
                            <li>• Try signing up again to resend the verification email</li>
                        </ul>
                    </div>
                    <Link
                        to="/login"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
export default VerifyEmailPending;
