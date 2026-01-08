import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isActive = (path) => location.pathname === path;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="glass rounded-2xl shadow-soft">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between h-16">
                            {}
                            <Link to="/" className="flex items-center space-x-2 group" aria-label="Unirooms Home">
                                <img src="/logo.png" alt="Unirooms Logo" className="w-10 h-10 rounded-xl" loading="eager" />
                                <span className="text-xl font-display font-bold text-neutral-800">Unirooms</span>
                            </Link>
                            {}
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
                                {}
                                {isAuthenticated && user?.role === 'landlord' && (
                                    <Link
                                        to="/landlord/dashboard"
                                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive('/landlord/dashboard')
                                            ? 'text-primary-700'
                                            : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Dashboard
                                        {isActive('/landlord/dashboard') && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-primary-50 border border-primary-100 rounded-xl -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                )}
                                {}
                                {isAuthenticated && user?.email === 'alkardorhd@gmail.com' && (
                                    <Link
                                        to="/admin/properties"
                                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/properties')
                                            ? 'text-red-700'
                                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                            }`}
                                    >
                                        Admin
                                        {isActive('/admin/properties') && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-red-50 border border-red-100 rounded-xl -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                )}
                            </div>
                            {}
                            <div className="hidden md:flex items-center space-x-3">
                                {isAuthenticated ? (
                                    <div className="flex items-center space-x-4">
                                        <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt={user?.name || 'User'}
                                                    className="w-9 h-9 rounded-xl object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center"
                                                style={{ display: user?.profileImage ? 'none' : 'flex' }}
                                            >
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
                            {}
                            <div className="md:hidden relative" ref={dropdownRef}>
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors"
                                    >
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user?.name || 'User'}
                                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary-200"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center ring-2 ring-primary-200"
                                            style={{ display: user?.profileImage ? 'none' : 'flex' }}
                                        >
                                            <span className="text-white font-semibold text-sm">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <svg 
                                            className={`w-4 h-4 text-neutral-600 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {mobileMenuOpen ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            )}
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute right-4 top-20 w-72 z-50"
                    >
                        <div className="glass rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
                            {}
                            {isAuthenticated && (
                                <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 border-b border-primary-200">
                                    <div className="flex items-center space-x-3">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user?.name || 'User'}
                                                className="w-12 h-12 rounded-xl object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center"
                                            style={{ display: user?.profileImage ? 'none' : 'flex' }}
                                        >
                                            <span className="text-white font-bold text-lg">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-neutral-800 truncate">{user?.name}</p>
                                            <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
                                            <p className="text-xs text-primary-700 font-medium capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {}
                            <div className="p-2">
                                {[
                                    { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                    { path: '/browse', label: 'Browse', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                                    { path: '/about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                {}
                                {isAuthenticated && user?.role === 'landlord' && (
                                    <Link
                                        to="/landlord/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/landlord/dashboard')
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
                                        </svg>
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                {}
                                {isAuthenticated && user?.email === 'alkardorhd@gmail.com' && (
                                    <Link
                                        to="/admin/properties"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/admin/properties')
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span>Admin Panel</span>
                                    </Link>
                                )}
                                {}
                                {isAuthenticated ? (
                                    <>
                                        <div className="my-2 border-t border-neutral-200"></div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/saved"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span>Saved Properties</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="my-2 border-t border-neutral-200"></div>
                                        <Link 
                                            to="/login" 
                                            onClick={() => setMobileMenuOpen(false)} 
                                            className="block px-4 py-3 text-center rounded-xl font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            to="/signup" 
                                            onClick={() => setMobileMenuOpen(false)} 
                                            className="block px-4 py-3 text-center rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </>
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
