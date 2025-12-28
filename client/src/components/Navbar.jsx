import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="glass rounded-2xl shadow-soft">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-2 group">
                                <img src="/logo.png" alt="Unirooms" className="w-10 h-10 rounded-xl" />
                                <span className="text-xl font-display font-bold text-neutral-800">Unirooms</span>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center space-x-1">
                                {[
                                    { path: '/', label: 'Home' },
                                    { path: '/browse', label: 'Browse' },
                                    { path: '/about', label: 'About' },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive(item.path)
                                            ? 'text-primary-700'
                                            : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                                            }`}
                                    >
                                        {item.label}
                                        {isActive(item.path) && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-primary-50 border border-primary-100 rounded-xl -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                ))}
                            </div>

                            {/* Auth Section */}
                            <div className="hidden md:flex items-center space-x-3">
                                {isAuthenticated ? (
                                    <div className="flex items-center space-x-4">
                                        <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-neutral-800">{user?.name}</p>
                                                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="text-neutral-500 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login" className="btn-secondary text-sm">
                                            Sign In
                                        </Link>
                                        <Link to="/signup" className="btn-primary text-sm">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden mx-4 mt-2"
                    >
                        <div className="glass rounded-2xl shadow-soft p-4 space-y-2">
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/browse', label: 'Browse' },
                                { path: '/about', label: 'About' },
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path)
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-neutral-200 space-y-2">
                                {!isAuthenticated ? (
                                    <>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block btn-secondary text-center">
                                            Sign In
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block btn-primary text-center">
                                            Get Started
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={logout} className="w-full btn-secondary text-red-500 border-red-200">
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
