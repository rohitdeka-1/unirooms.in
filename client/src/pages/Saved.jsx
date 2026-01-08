import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { savedPropertyAPI } from '../utils/api';
const Saved = () => {
    const { isAuthenticated } = useAuth();
    const [savedProperties, setSavedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedProperties();
        }
    }, [isAuthenticated]);
    const fetchSavedProperties = async () => {
        try {
            setLoading(true);
            const response = await savedPropertyAPI.getSavedProperties();
            setSavedProperties(response.data || []);
        } catch (error) {
            console.error('Error fetching saved properties:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleUnsave = async (propertyId) => {
        try {
            await savedPropertyAPI.unsaveProperty(propertyId);
            setSavedProperties(savedProperties.filter(p => p._id !== propertyId));
        } catch (error) {
            console.error('Error unsaving property:', error);
        }
    };
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
                            {}
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-display font-bold text-neutral-800 mb-3">
                                Save Your Favorites
                            </h1>
                            <p className="text-neutral-500 mb-8">
                                Sign in to save and manage your favorite PG accommodations. Keep track of places you love and compare them easily.
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
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {}
                    <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-4">
                        <Link to="/" className="hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-neutral-700 font-medium">Saved Properties</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                                Saved Properties
                            </h1>
                            <p className="text-neutral-500 mt-1">
                                {savedProperties.length} properties saved
                            </p>
                        </div>
                        {}
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/browse"
                                className="btn-secondary text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Browse More
                            </Link>
                        </div>
                    </div>
                </motion.div>
                {}
                {savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {savedProperties.map((property, index) => (
                                <motion.div
                                    key={property._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <PropertyCard 
                                        property={property} 
                                        onUnsave={() => handleUnsave(property._id)}
                                        isSaved={true}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">
                            No Saved Properties Yet
                        </h3>
                        <p className="text-neutral-500 mb-6">
                            Start browsing and save your favorite PGs to view them here
                        </p>
                        <Link to="/browse" className="btn-primary">
                            Browse Properties
                        </Link>
                    </motion.div>
                )}
                {}
                {savedProperties.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12"
                    >
                        <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-bold text-neutral-800 mb-1">
                                        Pro Tip
                                    </h4>
                                    <p className="text-neutral-600">
                                        Compare your saved properties side by side to find the best fit. Consider factors like distance from college, amenities, and price when making your decision.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
export default Saved;
