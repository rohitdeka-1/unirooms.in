import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { propertyAPI } from '../utils/api';
import { updateMetaTags, generatePropertyStructuredData, addStructuredData } from '../utils/seo';
const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await propertyAPI.getPropertyById(id);
                if (response.success) {
                    setProperty(response.data.property || response.data);
                }
            } catch (err) {
                console.error('Error fetching property:', err);
                setError(err.message || 'Failed to fetch property details');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchProperty();
        }
    }, [id]);
    useEffect(() => {
        if (property) {
            const propertyTitle = `${property.title || 'PG Accommodation'} | ${property.nearbyCollege || property.city || 'Near College'} | Unirooms`;
            const propertyDescription = `${property.description || `Find ${property.roomType || 'PG accommodation'} near ${property.nearbyCollege || property.city}.`} ₹${property.rent || property.price}/month. ${property.amenities?.join(', ') || 'Great amenities'}. Book now!`;
            updateMetaTags({
                title: propertyTitle,
                description: propertyDescription,
                keywords: `PG near ${property.nearbyCollege || property.city}, ${property.roomType}, ${property.gender} PG, PG accommodation, student housing`,
                image: property.images?.[0] || '/logo.png',
                url: `https://unirooms.in/property/${id}`,
                type: 'product'
            });
            const structuredData = generatePropertyStructuredData(property);
            addStructuredData(structuredData);
        }
    }, [property, id]);
    const handleContactClick = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-dark-50 pt-24 pb-24 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-neutral-600">Loading property details...</p>
                </div>
            </div>
        );
    }
    if (error || !property) {
        return (
            <div className="min-h-screen bg-dark-50 pt-24 pb-24 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Property Not Found</h2>
                    <p className="text-neutral-600 mb-6">{error || 'This property does not exist or has been removed.'}</p>
                    <button onClick={() => navigate('/browse')} className="btn-primary">
                        Browse Properties
                    </button>
                </div>
            </div>
        );
    }
    const propertyTitle = property.title || property.name || 'Property';
    const propertyLocation = property.address 
        ? `${property.address.locality}, ${property.city}`
        : property.location || 'Location not specified';
    // Use pre-optimized URLs from backend
    const propertyImages = property.images?.length > 0 
        ? property.images.map(img => img.sizes?.large || img.url || img)
        : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'];
    const amenitiesMap = {
        wifi: 'High-Speed WiFi',
        ac: 'AC Rooms',
        laundry: 'Laundry',
        parking: 'Parking',
        security: 'Security',
        cctv: 'CCTV',
        powerBackup: 'Power Backup',
        attached_bathroom: 'Attached Bathroom',
        furnished: 'Furnished',
        semifurnished: 'Semi-Furnished',
        geyser: 'Geyser',
        fridge: 'Fridge',
        tv: 'TV',
        studyTable: 'Study Table',
        wardrobe: 'Wardrobe',
        balcony: 'Balcony',
        meals: 'Meals',
        gym: 'Gym',
        water: 'Water 24/7',
        electricity: 'Electricity'
    };
    const facilities = property.amenities?.map(amenity => ({
        name: amenitiesMap[amenity] || amenity,
        icon: amenity
    })) || [];
    const landlord = {
        name: property.landlordId?.name || 'Property Owner',
        phone: property.phone || 'Not available',
        email: property.landlordId?.email || '',
        verified: property.isVerified || false,
    };
    return (
        <div className="min-h-screen bg-dark-50 pt-20 sm:pt-24 pb-20 sm:pb-24 md:pb-12">
            <div className="container mx-auto px-3 sm:px-4">
                {}
                <nav className="flex items-center space-x-2 text-xs sm:text-sm mb-3 sm:mb-6 mt-4">
                    <Link to="/" className="text-dark-500 hover:text-primary-600">Home</Link>
                    <span className="text-dark-300">/</span>
                    <Link to="/properties" className="text-dark-500 hover:text-primary-600">PGs</Link>
                    <span className="text-dark-300">/</span>
                    <span className="text-dark-700">{property.name}</span>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-6">
                        {}
                        <div className="card overflow-hidden">
                            <div className="relative h-64 sm:h-80 md:h-[450px] bg-neutral-900">
                                <motion.img
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={propertyImages[currentImage]}
                                    alt={propertyTitle}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                />
                                {}
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : propertyImages.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                                >
                                    <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev < propertyImages.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                                >
                                    <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                {}
                                <button className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition">
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {}
                            <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-4 bg-dark-50 overflow-x-auto">
                                {propertyImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`flex-shrink-0 w-16 h-14 sm:w-24 sm:h-20 rounded-lg overflow-hidden transition-all ${
                                            currentImage === index ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img 
                                            src={img} 
                                            alt="" 
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover" 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {}
                        <div className="card p-3 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-dark-900 mb-1.5 sm:mb-2">
                                        {propertyTitle}
                                    </h1>
                                    <div className="flex flex-col gap-1.5 sm:gap-2">
                                        <p className="text-dark-500 flex items-center text-xs sm:text-sm">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {propertyLocation}
                                        </p>
                                        {property.location?.coordinates && (
                                            isAuthenticated ? (
                                                <a
                                                    href={`https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm transition-colors"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View on Google Maps
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={handleContactClick}
                                                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm transition-colors"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Login to Get Location
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    {}
                                    {property.campusName && (
                                        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-50 rounded-lg border border-primary-200">
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="text-xs sm:text-sm font-semibold text-primary-700 truncate max-w-[120px] sm:max-w-none">{property.campusName}</span>
                                            </div>
                                        </div>
                                    )}
                                    {}
                                    <div className="px-2 py-1 sm:px-4 sm:py-2 bg-amber-50 rounded-xl">
                                        <div className="flex items-center space-x-1 sm:space-x-1 sm:space-x-2">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        <span className="font-bold text-dark-800 text-sm sm:text-base">{property.averageRating || 0}</span>
                                        <span className="text-dark-500 text-[10px] sm:text-sm">({property.totalReviews || 0})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="card p-3 sm:p-6">
                            <h2 className="text-base sm:text-xl font-display font-bold text-dark-900 mb-2 sm:mb-4">About This PG</h2>
                            <p className="text-dark-600 leading-relaxed text-sm sm:text-base">{property.description || 'No description available.'}</p>
                        </div>
                        {}
                        <div className="card p-3 sm:p-3 sm:p-6">
                            <h2 className="text-base sm:text-xl font-display font-bold text-dark-900 mb-3 sm:mb-6">Amenities & Facilities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                                {facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-dark-50 rounded-xl">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-dark-700 font-medium text-xs sm:text-sm truncate">{facility.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="lg:col-span-1">
                        <div className="card p-4 sm:p-6 lg:sticky lg:top-28">
                            {}
                            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-dark-100">
                                <p className="text-dark-500 text-xs sm:text-sm mb-1">Monthly Rent</p>
                                <div className="flex items-baseline">
                                    <span className="text-2xl sm:text-4xl font-display font-bold gradient-text">₹{property.price?.toLocaleString()}</span>
                                    <span className="text-dark-400 ml-2 text-xs sm:text-base">/month</span>
                                </div>
                                {property.securityDeposit > 0 && (
                                    <p className="text-xs sm:text-sm text-dark-500 mt-2">Security Deposit: ₹{property.securityDeposit.toLocaleString()}</p>
                                )}
                            </div>
                            {}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="font-display font-bold text-dark-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                                    Landlord Contact
                                    {landlord.verified && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Verified</span>
                                    )}
                                </h3>
                                {isAuthenticated ? (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-dark-50 rounded-xl">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-dark-700 font-medium text-sm sm:text-base truncate">{landlord.name}</span>
                                        </div>
                                        <a href={`tel:${landlord.phone}`} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <span className="text-green-700 font-semibold text-sm sm:text-base">{landlord.phone}</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div
                                        onClick={handleContactClick}
                                        className="p-4 sm:p-6 bg-gradient-to-br from-dark-50 to-dark-100 rounded-xl cursor-pointer hover:shadow-card transition-all text-center border-2 border-dashed border-dark-200"
                                    >
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 bg-primary-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <p className="font-semibold text-dark-700 mb-1 text-sm sm:text-base">Login to View Contact</p>
                                        <p className="text-xs sm:text-sm text-dark-500">Sign in to get landlord details</p>
                                    </div>
                                )}
                            </div>
                            {isAuthenticated ? (
                                <a 
                                    href={property.location?.coordinates 
                                        ? `https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`
                                        : '#'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary py-2.5 sm:py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Visit on Maps
                                </a>
                            ) : (
                                <div
                                    onClick={handleContactClick}
                                    className="w-full btn-primary py-2.5 sm:py-3.5 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Login to Visit on Maps
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-dark-900 mb-2">Login Required</h3>
                                <p className="text-dark-500">Sign in to view landlord contact details</p>
                            </div>
                            <div className="space-y-3">
                                <button onClick={() => navigate('/login')} className="w-full btn-primary py-3">
                                    Sign In
                                </button>
                                <button onClick={() => navigate('/signup')} className="w-full btn-secondary py-3">
                                    Create Free Account
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default PropertyDetail;
