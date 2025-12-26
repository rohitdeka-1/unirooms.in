import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    // Mock property data
    const property = {
        id: id,
        name: 'Sunrise Premium PG',
        location: 'Near IIT Delhi, Hauz Khas, New Delhi',
        address: '123, ABC Street, Hauz Khas Village',
        price: 8500,
        rating: 4.8,
        reviews: 124,
        images: [
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
        about: 'Welcome to Sunrise Premium PG, where we ensure the best living experience for students. Our facility offers spacious rooms, modern amenities, and a comfortable environment perfect for focused studying and relaxed living. Located just 5 minutes from IIT Delhi campus.',
        facilities: [
            { name: 'High-Speed WiFi', icon: 'wifi' },
            { name: 'AC Rooms', icon: 'ac' },
            { name: 'Laundry', icon: 'laundry' },
            { name: 'Parking', icon: 'parking' },
            { name: 'CCTV Security', icon: 'security' },
            { name: 'Power Backup', icon: 'power' },
        ],
        landlord: {
            name: 'Rajesh Kumar',
            phone: '+91 9876543210',
            email: 'rajesh@example.com',
            verified: true,
        },
    };

    const handleContactClick = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-dark-50 pt-24 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm mb-6">
                    <Link to="/" className="text-dark-500 hover:text-primary-600">Home</Link>
                    <span className="text-dark-300">/</span>
                    <Link to="/properties" className="text-dark-500 hover:text-primary-600">PGs</Link>
                    <span className="text-dark-300">/</span>
                    <span className="text-dark-700">{property.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="card overflow-hidden">
                            <div className="relative h-80 md:h-[450px]">
                                <motion.img
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={property.images[currentImage]}
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                                >
                                    <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                                >
                                    <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Favorite */}
                                <button className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 p-4 bg-dark-50">
                                {property.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`flex-1 h-20 rounded-lg overflow-hidden transition-all ${currentImage === index ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="card p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mb-2">
                                        {property.name}
                                    </h1>
                                    <p className="text-dark-500 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {property.location}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 rounded-xl">
                                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-bold text-dark-800">{property.rating}</span>
                                    <span className="text-dark-500 text-sm">({property.reviews} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="card p-6">
                            <h2 className="text-xl font-display font-bold text-dark-900 mb-4">About This PG</h2>
                            <p className="text-dark-600 leading-relaxed">{property.about}</p>
                        </div>

                        {/* Facilities */}
                        <div className="card p-6">
                            <h2 className="text-xl font-display font-bold text-dark-900 mb-6">Amenities & Facilities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-dark-50 rounded-xl">
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-dark-700 font-medium">{facility.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-28">
                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-dark-100">
                                <p className="text-dark-500 text-sm mb-1">Monthly Rent</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-display font-bold gradient-text">₹{property.price.toLocaleString()}</span>
                                    <span className="text-dark-400 ml-2">/month</span>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="mb-6">
                                <h3 className="font-display font-bold text-dark-900 mb-4 flex items-center">
                                    Landlord Contact
                                    {property.landlord.verified && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Verified</span>
                                    )}
                                </h3>

                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 bg-dark-50 rounded-xl">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-dark-700 font-medium">{property.landlord.name}</span>
                                        </div>
                                        <a href={`tel:${property.landlord.phone}`} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <span className="text-green-700 font-semibold">{property.landlord.phone}</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div
                                        onClick={handleContactClick}
                                        className="p-6 bg-gradient-to-br from-dark-50 to-dark-100 rounded-xl cursor-pointer hover:shadow-card transition-all text-center border-2 border-dashed border-dark-200"
                                    >
                                        <div className="w-14 h-14 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center">
                                            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <p className="font-semibold text-dark-700 mb-1">Login to View Contact</p>
                                        <p className="text-sm text-dark-500">Sign in to get landlord details</p>
                                    </div>
                                )}
                            </div>

                            <button className="w-full btn-primary py-3.5">
                                Schedule Visit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
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
