import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { savedPropertyAPI } from '../utils/api';

const getBlurPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
};

const formatViews = (views) => {
    if (views < 1000) return views.toString();
    const k = views / 1000;
    if (k >= 10) return Math.floor(k) + 'k';
    return k.toFixed(k % 1 === 0 ? 0 : 2).replace(/\.?0+$/, '') + 'k';
};
const PropertyCard = ({ property, onUnsave, isSaved: initialSaved = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const propertyId = property._id || property.id;
    const propertyTitle = property.title || property.name;
    
    // Get cover image based on coverImageIndex, fallback to first image
    const coverIndex = property.coverImageIndex || 0;
    const coverImage = property.images?.[coverIndex];
    
    // Use pre-optimized URLs from backend
    const propertyImage = coverImage?.sizes?.card || coverImage?.url || property.images?.[0]?.sizes?.card || property.images?.[0]?.url || property.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';
    
    const propertyLocation = property.address 
        ? `${property.address.locality}, ${property.city}`
        : property.location || 'Location not specified';
    useEffect(() => {
        if (isAuthenticated && propertyId && !initialSaved) {
            checkSavedStatus();
        }
    }, [isAuthenticated, propertyId]);
    const checkSavedStatus = async () => {
        try {
            const response = await savedPropertyAPI.checkIfSaved(propertyId);
            setIsSaved(response.isSaved);
        } catch (error) {
            console.error('Error checking saved status:', error);
        }
    };
    const handleSaveToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        setIsLoading(true);
        try {
            if (isSaved) {
                await savedPropertyAPI.unsaveProperty(propertyId);
                setIsSaved(false);
                if (onUnsave) onUnsave();
            } else {
                await savedPropertyAPI.saveProperty(propertyId);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const formatPropertyType = () => {
        if (property.type) return property.type; 
        if (property.roomType) {
            const typeMap = {
                'single': 'Single Room',
                'double': 'Double Sharing',
                'triple': 'Triple Sharing',
                'shared': 'Shared Room'
            };
            const roomTypeLabel = typeMap[property.roomType] || property.roomType;
            const genderLabel = property.gender === 'male' ? 'Boys' : property.gender === 'female' ? 'Girls' : '';
            return genderLabel ? `${genderLabel} ${roomTypeLabel}` : roomTypeLabel;
        }
        return 'PG';
    };
    return (
        <motion.div
            className="group card overflow-hidden w-full h-full max-w-sm mx-auto"
        >
            <Link to={`/property/${propertyId}`} className="block h-full">
                {}
                <div className="relative h-56 sm:h-60 overflow-hidden rounded-t-2xl bg-neutral-100">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse" />
                    )}
                    <img
                        src={propertyImage}
                        alt={propertyTitle}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                    {}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {}
                    <button 
                        onClick={handleSaveToggle}
                        disabled={isLoading}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 disabled:opacity-50"
                    >
                        <svg 
                            className={`w-5 h-5 transition-colors ${
                                isSaved ? 'text-red-500 fill-red-500' : 'text-neutral-600'
                            }`} 
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    {}
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-neutral-700 shadow-lg">
                            {formatPropertyType()}
                        </span>
                    </div>
                </div>
                {}
                <div className="p-3 sm:p-4">
                    {}
                    <h3 className="font-display font-bold text-base sm:text-lg text-neutral-800 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {propertyTitle}
                    </h3>
                    {}
                    <p className="text-neutral-500 text-xs sm:text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{propertyLocation}</span>
                    </p>
                    {}
                    {property.campusName && (
                        <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="line-clamp-1">{property.campusName}</span>
                            </span>
                        </div>
                    )}
                    {}
                    {property.distanceInKm !== undefined && (
                        <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {property.distanceInKm} km away
                            </span>
                        </div>
                    )}
                    {}
                    <div className="flex items-center justify-between pt-2 mt-2 sm:mt-0 border-t border-neutral-100">
                        {}
                        <div className={`flex items-center space-x-1.5 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg ${property.views >= 100 ? 'bg-gradient-to-br from-orange-300 to-red-400' : 'bg-amber-50'}`}>
                            {property.views >= 100 ? (
                                <img 
                                    src="/Fire.gif" 
                                    alt="Trending" 
                                    className="w-4 h-4"
                                />
                            ) : (
                                <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                            <span className={`font-bold text-sm ${property.views >= 100 ? 'text-white drop-shadow-lg' : 'text-neutral-700'}`}>{formatViews(property.views || 0)} views</span>
                        </div>
                        {}
                        <div className="text-right">
                            <div>
                                <span className="text-xl sm:text-2xl font-display font-bold text-primary-600">₹{property.price?.toLocaleString()}</span>
                            </div>
                            <span className="text-neutral-400 text-[10px] sm:text-xs font-medium">/month</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
export default PropertyCard;
