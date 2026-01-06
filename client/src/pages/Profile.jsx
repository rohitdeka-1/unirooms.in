import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Profile = () => {
    const { isAuthenticated, user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                college: user.college || ''
            });
        }
    }, [user]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'grid' },
        { id: 'settings', label: 'Settings', icon: 'cog' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Validate phone number if provided
            if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
                alert('Please enter a valid 10-digit Indian phone number');
                setLoading(false);
                return;
            }

            await authAPI.updateProfile({
                name: formData.name,
                phone: formData.phone || undefined,
                college: formData.college || undefined,
            });

            // Refresh user data in context
            if (refreshUser) {
                await refreshUser();
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center"
                    >
                        <div className="card p-12">
                            {/* Icon */}
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-display font-bold text-neutral-800 mb-3">
                                Your Profile
                            </h1>
                            <p className="text-neutral-500 mb-8">
                                Sign in to access your profile, view saved properties, and manage your account settings.
                            </p>

                            <div className="space-y-3">
                                <Link to="/login" className="block btn-primary w-full">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="block btn-secondary w-full">
                                    Create Account
                                </Link>
                            </div>

                            <p className="text-neutral-400 text-sm mt-6">
                                Join 10,000+ students who found their perfect PG
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="card p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user?.name || 'User'}
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg"
                                    style={{ display: user?.profileImage ? 'none' : 'flex' }}
                                >
                                    <span className="text-white font-display font-bold text-4xl md:text-5xl">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-800">
                                            {user?.name || 'User'}
                                        </h1>
                                        <p className="text-neutral-500 mt-1">{user?.email || 'user@example.com'}</p>
                                        <div className="flex items-center space-x-4 mt-3">
                                            <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                {user?.role === 'landlord' ? 'Landlord' : user?.role === 'admin' ? 'Admin' : 'Student'}
                                            </span>
                                            {user?.createdAt && (
                                                <span className="text-neutral-400 text-sm">
                                                    Member since {formatDate(user.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3">
                                        {user?.role === 'landlord' && (
                                            <Link to="/landlord-dashboard" className="btn-secondary text-sm">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                My Properties
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats - Removed dummy stats */}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="card p-4 sticky top-28">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === tab.id
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {tab.icon === 'grid' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            )}
                                            {tab.icon === 'cog' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            )}
                                        </svg>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}

                                <div className="border-t border-neutral-100 my-4" />

                                <Link
                                    to="/saved"
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-neutral-600 hover:bg-neutral-100 text-left"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>Saved Properties</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-red-500 hover:bg-red-50 text-left"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="card p-6">
                                    <h2 className="text-lg font-display font-bold text-neutral-800 mb-4">
                                        Quick Actions
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link
                                            to="/browse"
                                            className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-neutral-700">Browse PGs</span>
                                        </Link>
                                        <Link
                                            to="/saved"
                                            className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-neutral-700">Saved PGs</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="card p-6">
                                    <h2 className="text-lg font-display font-bold text-neutral-800 mb-4">
                                        Account Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between p-4 bg-neutral-50 rounded-xl">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-neutral-500">Email</p>
                                                    <p className="font-medium text-neutral-700">{user?.email}</p>
                                                </div>
                                            </div>
                                            {user?.emailVerified && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-xl">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-500">Account Type</p>
                                                <p className="font-medium text-neutral-700 capitalize">{user?.role || 'Student'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-display font-bold text-neutral-800">
                                        Account Settings
                                    </h2>
                                    {!isEditing && (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="btn-secondary text-sm"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="input-field disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    className="input-field disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                                    placeholder="your@email.com"
                                                />
                                                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone || ''}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="input-field disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                                    placeholder="Enter 10-digit phone number"
                                                    maxLength="10"
                                                />
                                                {!user?.phone && (
                                                    <p className="text-xs text-amber-600 mt-1">⚠️ Please add your phone number</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">College/University</label>
                                                <input
                                                    type="text"
                                                    name="college"
                                                    value={formData.college}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="input-field disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                                    placeholder="Your college name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="border-t border-neutral-100 pt-6 flex space-x-3">
                                            <button 
                                                onClick={handleSaveProfile}
                                                disabled={loading}
                                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user?.name || '',
                                                        email: user?.email || '',
                                                        phone: user?.phone || '',
                                                        college: user?.college || ''
                                                    });
                                                }}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
