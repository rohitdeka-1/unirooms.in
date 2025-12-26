import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group card overflow-hidden w-full lg:max-w-xs"
        >
            <Link to={`/property/${property.id}`}>
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                    <img
                        src={property.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Favorite Button */}
                    <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                        <svg className="w-4 h-4 text-neutral-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Type Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-700 shadow-lg">
                            {property.type || 'PG'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="font-display font-bold text-base text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors truncate">
                        {property.name}
                    </h3>

                    {/* Location */}
                    <p className="text-neutral-500 text-sm mb-3 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{property.location}</span>
                    </p>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between">
                        {/* Rating */}
                        <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg">
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold text-neutral-700 text-sm">{property.rating || '4.5'}</span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <span className="text-xl font-display font-bold text-primary-600">₹{property.price?.toLocaleString()}</span>
                            <span className="text-neutral-400 text-sm">/mo</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PropertyCard;
