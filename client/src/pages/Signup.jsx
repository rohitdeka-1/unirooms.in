import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col justify-center p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-6">
                            Start your journey<br />to comfort
                        </h2>
                        <p className="text-white/80 text-lg max-w-md">
                            Join thousands of students and landlords on India's most trusted PG platform - Unirooms.
                        </p>

                        <div className="mt-12 space-y-4">
                            {['Verified PG listings', 'Direct landlord contact', 'Secure & trusted'].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-white/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 relative z-10 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                            <img src="/logo.png" alt="Unirooms" className="w-10 h-10 rounded-xl" />
                            <span className="text-xl font-display font-bold text-neutral-800">Unirooms</span>
                        </Link>

                        <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">
                            Create your account
                        </h1>
                        <p className="text-dark-500">
                            Join Unirooms today and find your perfect accommodation.
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-3">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['student', 'landlord'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${formData.role === role
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-dark-200 text-dark-600 hover:border-dark-300'
                                            }`}
                                    >
                                        {role === 'student' ? '🎓 Student' : '🏠 Landlord'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Email Address</label>
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
                            <label className="block text-sm font-medium text-dark-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                required
                                pattern="[6-9][0-9]{9}"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field"
                                placeholder="9876543210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>

                        <p className="text-xs text-center text-dark-400">
                            By signing up, you agree to our{' '}
                            <a href="#" className="text-primary-600 hover:underline">Terms</a> and{' '}
                            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                        </p>
                    </form>

                    <p className="mt-6 text-center text-dark-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
