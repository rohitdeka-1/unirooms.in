import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');  
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false);
    useEffect(() => {
        const verifyEmail = async () => {
             if (hasVerified.current) {
                return;
            }
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }
            hasVerified.current = true;
            try {
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://unirooms-api-2026-be019c91a062.herokuapp.com/api/v1';
                const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
                const data = await response.json();
                if (response.ok) {
                    setStatus('success');
                     if (data.data?.alreadyVerified) {
                        setMessage('Your email is already verified! You can login now.');
                        setTimeout(() => {
                            navigate('/login');
                        }, 3000);
                    } else {
                        setMessage(data.message || 'Email verified successfully! Redirecting to home...');
                        if (data.data?.accessToken) {
                            localStorage.setItem('accessToken', data.data.accessToken);
                        }
                        if (data.data?.refreshToken) {
                            localStorage.setItem('refreshToken', data.data.refreshToken);
                        }
                        if (data.data?.user) {
                            localStorage.setItem('user', JSON.stringify(data.data.user));
                        }
                        setTimeout(() => {
                            navigate('/');
                            window.location.reload(); 
                        }, 2000);
                    }
                } else {
                    setStatus('error');
                    if (data.data?.expired) {
                        setMessage('Your verification link has expired. Please sign up again or request a new verification email.');
                    } else {
                        setMessage(data.message || 'Verification failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Unable to verify email. Please check your internet connection and try again.');
            }
        };
        verifyEmail();
    }, [token, navigate]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                        <img src="/logo.png" alt="Unirooms" className="w-12 h-12 rounded-xl" />
                        <span className="text-2xl font-display font-bold text-neutral-800">Unirooms</span>
                    </Link>
                    {status === 'verifying' && (
                        <div>
                            <div className="w-16 h-16 mx-auto mb-6">
                                <svg className="animate-spin h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                Verifying your email...
                            </h2>
                            <p className="text-neutral-600">
                                Please wait while we verify your email address.
                            </p>
                        </div>
                    )}
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                Email Verified!
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                {message}
                            </p>
                            <p className="text-sm text-neutral-500 mb-4">
                                Redirecting to login page in 3 seconds...
                            </p>
                            <Link
                                to="/login"
                                className="inline-block btn-primary px-8 py-3 rounded-xl"
                            >
                                Go to Login
                            </Link>
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                Verification Failed
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                {message}
                            </p>
                            <p className="text-sm text-neutral-500 mb-6">
                                The verification link may have expired or been used already. 
                                Please request a new verification email or try logging in if you've already verified.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="inline-block btn-primary px-6 py-2.5 rounded-xl"
                                >
                                    Try Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-block btn-secondary px-6 py-2.5 rounded-xl"
                                >
                                    Sign Up Again
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
export default VerifyEmail;
