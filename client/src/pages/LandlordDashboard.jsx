import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, paymentAPI } from '../utils/api';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const LandlordDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [stats, setStats] = useState(null);
    const [credits, setCredits] = useState({ total: 0, used: 0, remaining: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('properties');

    useEffect(() => {
        if (user?.role !== 'landlord') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [propertiesRes, statsRes, paymentsRes] = await Promise.all([
                propertyAPI.getMyProperties(),
                propertyAPI.getStats(),
                paymentAPI.getMyPayments(),
            ]);
            setProperties(propertiesRes.data.properties);
            setStats(statsRes.data.stats);
            
            // Calculate credits
            const payments = paymentsRes.data.payments || [];
            const totalPaidCredits = payments
                .filter(p => p.status === 'success' && p.purpose === 'property_listing')
                .reduce((sum, p) => sum + (p.propertiesCount || 1), 0);
            const usedCredits = propertiesRes.data.properties.length;
            
            setCredits({
                total: totalPaidCredits,
                used: usedCredits,
                remaining: totalPaidCredits - usedCredits
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (propertyId) => {
        try {
            await propertyAPI.toggleStatus(propertyId);
            fetchData();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert(error.message);
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        
        try {
            await propertyAPI.deleteProperty(propertyId);
            fetchData();
        } catch (error) {
            console.error('Error deleting property:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                                Landlord Dashboard
                            </h1>
                            <p className="text-neutral-600 mt-1">Welcome back, {user?.name}!</p>
                        </div>
                        <Link to="/landlord/add-property" className="btn-primary">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Property
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                >
                    {[
                        { label: 'Total Properties', value: stats?.totalProperties || 0, icon: '🏠', color: 'from-blue-400 to-blue-600' },
                        { label: 'Active', value: stats?.activeProperties || 0, icon: '✅', color: 'from-green-400 to-green-600' },
                        { label: 'Views', value: stats?.totalViews || 0, icon: '👁️', color: 'from-purple-400 to-purple-600' },
                        { label: 'Contacts', value: stats?.totalContactRequests || 0, icon: '📞', color: 'from-orange-400 to-orange-600' },
                        { label: 'Verified', value: stats?.verifiedProperties || 0, icon: '✓', color: 'from-teal-400 to-teal-600' },
                        { label: 'Pending', value: stats?.pendingVerification || 0, icon: '⏳', color: 'from-yellow-400 to-yellow-600' },
                    ].map((stat, index) => (
                        <div key={index} className="card p-4">
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-display font-bold text-neutral-800">{stat.value}</p>
                            <p className="text-neutral-500 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Credits Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="card mb-8"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-1">Listing Credits</h3>
                                <p className="text-sm text-neutral-600">Manage your property listing credits</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary-600">{credits.total}</p>
                                    <p className="text-xs text-neutral-500 mt-1">Total</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-600">{credits.used}</p>
                                    <p className="text-xs text-neutral-500 mt-1">Used</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-600">{credits.remaining}</p>
                                    <p className="text-xs text-neutral-500 mt-1">Remaining</p>
                                </div>
                            </div>
                        </div>
                        
                        {credits.remaining <= 0 && (
                            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-orange-800">Complete payment to proceed</p>
                                    <p className="text-sm text-orange-600 mt-1">Purchase more credits to list additional properties.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Properties List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    <div className="p-6 border-b border-neutral-200">
                        <h2 className="text-xl font-display font-bold text-neutral-800">Your Properties</h2>
                    </div>

                    {properties.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Properties Yet</h3>
                            <p className="text-neutral-500 mb-6">Start by adding your first property listing</p>
                            <Link to="/landlord/add-property" className="btn-primary inline-flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Property
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200">
                            {properties.map((property) => (
                                <div key={property._id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Property Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-24 h-24 bg-neutral-200 rounded-xl overflow-hidden">
                                                {property.images?.[0]?.url ? (
                                                    <img 
                                                        src={getOptimizedImageUrl(property.images[0].url, 'thumb')} 
                                                        alt={property.title} 
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Property Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">{property.title}</h3>
                                                    <p className="text-neutral-600 text-sm mb-2">
                                                        {property.address?.locality}, {property.city}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-lg font-bold text-primary-600">₹{property.price}/month</span>
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${property.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {property.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {!property.isVerified && (
                                                            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700" title="Property is awaiting admin verification">
                                                                Pending Verification
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
                                                <span>👁️ {property.views} views</span>
                                                <span>📞 {property.contactRequests} contacts</span>
                                                <span>🛏️ {property.availableRooms}/{property.totalRooms} available</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-2">
                                            <Link
                                                to={`/landlord/edit-property/${property._id}`}
                                                className="btn-secondary text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleToggleStatus(property._id)}
                                                className={`btn-secondary text-sm ${property.isActive ? 'border-yellow-300 text-yellow-700' : 'border-green-300 text-green-700'}`}
                                            >
                                                {property.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProperty(property._id)}
                                                className="btn-secondary text-sm border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LandlordDashboard;
