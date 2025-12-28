import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock user stats
    const userStats = {
        savedProperties: 12,
        contactedOwners: 5,
        viewedProperties: 47,
        memberSince: 'Jan 2024',
    };

    // Mock recent activity
    const recentActivity = [
        { id: 1, type: 'save', property: 'Sunrise Boys PG', time: '2 hours ago', icon: 'heart' },
        { id: 2, type: 'contact', property: 'Elite Girls Hostel', time: '1 day ago', icon: 'phone' },
        { id: 3, type: 'view', property: 'Urban Co-Living', time: '2 days ago', icon: 'eye' },
        { id: 4, type: 'save', property: 'Premium Boys Lodge', time: '3 days ago', icon: 'heart' },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'grid' },
        { id: 'settings', label: 'Settings', icon: 'cog' },
        { id: 'notifications', label: 'Notifications', icon: 'bell' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'heart':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                );
            case 'phone':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                );
            case 'eye':
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                );
            default:
                return null;
        }
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
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                                                {user?.role === 'owner' ? 'Property Owner' : 'Student'}
                                            </span>
                                            <span className="text-neutral-400 text-sm">
                                                Member since {userStats.memberSince}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3">
                                        <button className="btn-secondary text-sm">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-100">
                            {[
                                { label: 'Saved', value: userStats.savedProperties, icon: 'heart', color: 'text-red-500' },
                                { label: 'Contacted', value: userStats.contactedOwners, icon: 'phone', color: 'text-green-500' },
                                { label: 'Viewed', value: userStats.viewedProperties, icon: 'eye', color: 'text-primary-500' },
                                { label: 'Member Since', value: userStats.memberSince, icon: 'calendar', color: 'text-accent-500' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-2xl md:text-3xl font-display font-bold text-neutral-800">
                                        {stat.value}
                                    </p>
                                    <p className="text-neutral-500 text-sm mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
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
                                            {tab.icon === 'bell' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

                                {/* Recent Activity */}
                                <div className="card p-6">
                                    <h2 className="text-lg font-display font-bold text-neutral-800 mb-4">
                                        Recent Activity
                                    </h2>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-xl"
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'save' ? 'bg-red-100' :
                                                        activity.type === 'contact' ? 'bg-green-100' : 'bg-primary-100'
                                                    }`}>
                                                    <svg className={`w-5 h-5 ${activity.type === 'save' ? 'text-red-500' :
                                                            activity.type === 'contact' ? 'text-green-500' : 'text-primary-500'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {getActivityIcon(activity.icon)}
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-neutral-700">
                                                        {activity.type === 'save' && 'Saved '}
                                                        {activity.type === 'contact' && 'Contacted owner of '}
                                                        {activity.type === 'view' && 'Viewed '}
                                                        <span className="text-primary-600">{activity.property}</span>
                                                    </p>
                                                    <p className="text-neutral-400 text-sm">{activity.time}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="card p-6">
                                <h2 className="text-lg font-display font-bold text-neutral-800 mb-6">
                                    Account Settings
                                </h2>
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user?.name || ''}
                                                    className="input-field"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    defaultValue={user?.email || ''}
                                                    className="input-field"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="input-field"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-600 mb-2">College/University</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="Your college name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-100 pt-6">
                                        <button className="btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="card p-6">
                                <h2 className="text-lg font-display font-bold text-neutral-800 mb-6">
                                    Notification Preferences
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { id: 'email', label: 'Email Notifications', description: 'Receive updates about new properties matching your criteria' },
                                        { id: 'sms', label: 'SMS Notifications', description: 'Get text messages for important updates' },
                                        { id: 'push', label: 'Push Notifications', description: 'Receive in-app notifications' },
                                        { id: 'marketing', label: 'Marketing Emails', description: 'Receive tips, offers, and promotional content' },
                                    ].map((pref) => (
                                        <div key={pref.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                            <div>
                                                <p className="font-medium text-neutral-700">{pref.label}</p>
                                                <p className="text-sm text-neutral-500">{pref.description}</p>
                                            </div>
                                            <button className="relative w-12 h-6 rounded-full bg-neutral-200 transition-colors hover:bg-neutral-300">
                                                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                                            </button>
                                        </div>
                                    ))}
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
