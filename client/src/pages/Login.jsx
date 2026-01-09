import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await login(formData);
            toast.success('Login successful! Welcome back.');
            if (response.data.user.role === 'landlord') {
                navigate('/landlord/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.message || 'Login failed. Please check your credentials.');
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        setError('');
        try {
            const response = await googleLogin(credentialResponse.credential);
            toast.success('Google login successful!');
            if (response.data.user.role === 'landlord') {
                navigate('/landlord/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            // Check if user needs to signup first
            if (err.message?.includes('not found') || err.message?.includes('sign up')) {
                setShowSignupPrompt(true);
                setError('No account found with this Google account.');
                toast.error('No account found. Please create an account first!');
            } else {
                toast.error(err.message || 'Google login failed. Please try again.');
                setError(err.message || 'Google login failed. Please try again.');
            }
        } finally {
            setGoogleLoading(false);
        }
    };
    const handleGoogleError = () => {
        toast.error('Google login failed. Please try again.');
        setError('Google login failed. Please try again.');
    };
    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {}
            <div className="w-full lg:flex-1 flex items-center justify-center px-4 sm:px-6 py-12 lg:px-8 relative z-10 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="mb-10">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                            <img src="/logo.png" alt="Unirooms" className="w-10 h-10 rounded-xl" />
                            <span className="text-xl font-display font-bold text-neutral-800">Unirooms</span>
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-neutral-500">
                            Sign in to access landlord contacts and save your favorites.
                        </p>
                    </div>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Signup Prompt Modal */}
                    {showSignupPrompt && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-5 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-300 rounded-xl shadow-lg"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-neutral-900 mb-2">
                                        New to Unirooms? Create an account first!
                                    </h3>
                                    <p className="text-sm text-neutral-700 mb-3">
                                        We couldn't find an account associated with your Google email. You need to sign up before logging in.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            to="/signup"
                                            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Create Account
                                        </Link>
                                        <button
                                            onClick={() => setShowSignupPrompt(false)}
                                            className="inline-flex items-center justify-center px-4 py-2.5 bg-white border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Info banner for new users */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">New user?</span> You need to{' '}
                                <Link to="/signup" className="underline font-bold hover:text-blue-900">
                                    create an account
                                </Link>{' '}
                                before logging in.
                            </p>
                        </div>
                    </div>
                    {}
                    <div className="mb-6">
                        {googleLoading ? (
                            <div className="w-full flex items-center justify-center py-3.5 px-4 bg-neutral-100 border-2 border-neutral-200 rounded-xl">
                                <svg className="animate-spin h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    text="continue_with"
                                    shape="rectangular"
                                    width="400"
                                />
                            </div>
                        )}
                    </div>
                    {}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-neutral-400">or continue with email</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                                <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-neutral-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
                            Create one for free
                        </Link>
                    </p>
                </motion.div>
            </div>
            {}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-600 to-primary-700">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920')] bg-cover bg-center mix-blend-overlay opacity-15" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col justify-center p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-6">
                            Find your home<br />away from home
                        </h2>
                        <p className="text-white/80 text-lg max-w-md">
                            Access verified PG listings, connect with landlords, and find the perfect accommodation near your university.
                        </p>
                        <div className="mt-12 flex items-center space-x-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30" />
                                ))}
                            </div>
                            <p className="text-white/80 text-sm">
                                <span className="font-semibold text-white">10,000+</span> students trust Unirooms
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
export default Login;
