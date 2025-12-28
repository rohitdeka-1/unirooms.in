import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        setError('');
        try {
            // credentialResponse.credential is the ID token
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Google login failed. Please try again or sign up first.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 relative z-10 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
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

                    {/* Google Sign In Button */}
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

                    {/* Divider */}
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

            {/* Right Side - Image/Branding */}
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
