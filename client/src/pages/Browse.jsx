import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    // State
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedType, setSelectedType] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('recommended');
    const [showFilters, setShowFilters] = useState(false);

    // Mock properties data
    const allProperties = [
        {
            id: 1,
            name: 'Sunrise Boys PG',
            location: 'Near IIT Delhi, Hauz Khas',
            price: 8500,
            rating: 4.8,
            type: 'Boys PG',
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
            amenities: ['WiFi', 'AC', 'Food', 'Laundry'],
        },
        {
            id: 2,
            name: 'Elite Girls Hostel',
            location: 'DU North Campus, Delhi',
            price: 9500,
            rating: 4.9,
            type: 'Girls PG',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            amenities: ['WiFi', 'AC', 'Food', 'Security'],
        },
        {
            id: 3,
            name: 'Urban Co-Living',
            location: 'Near NIT, Kurukshetra',
            price: 7500,
            rating: 4.6,
            type: 'Co-Living',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
            amenities: ['WiFi', 'Gym', 'Laundry'],
        },
        {
            id: 4,
            name: 'Royal PG for Boys',
            location: 'VIT Bhopal, Madhya Pradesh',
            price: 6500,
            rating: 4.5,
            type: 'Boys PG',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
            amenities: ['WiFi', 'Food', 'Parking'],
        },
        {
            id: 5,
            name: 'Comfort Stay Girls',
            location: 'SRM University, Chennai',
            price: 11000,
            rating: 4.7,
            type: 'Girls PG',
            image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=400',
            amenities: ['WiFi', 'AC', 'Food', 'Security', 'Gym'],
        },
        {
            id: 6,
            name: 'Student Nest Hostel',
            location: 'VIT Vellore, Tamil Nadu',
            price: 8000,
            rating: 4.4,
            type: 'Hostel',
            image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
            amenities: ['WiFi', 'Food', 'Laundry'],
        },
        {
            id: 7,
            name: 'Premium Boys Lodge',
            location: 'Near BITS Pilani, Rajasthan',
            price: 12500,
            rating: 4.9,
            type: 'Boys PG',
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
            amenities: ['WiFi', 'AC', 'Food', 'Gym', 'Parking'],
        },
        {
            id: 8,
            name: 'City View Co-Living',
            location: 'Manipal University, Karnataka',
            price: 9000,
            rating: 4.6,
            type: 'Co-Living',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
            amenities: ['WiFi', 'AC', 'Laundry', 'Gym'],
        },
    ];

    // Property types for filter
    const propertyTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'Boys PG', label: 'Boys PG' },
        { value: 'Girls PG', label: 'Girls PG' },
        { value: 'Co-Living', label: 'Co-Living' },
        { value: 'Hostel', label: 'Hostel' },
    ];

    // Sort options
    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
    ];

    // Filter and sort properties
    const filteredProperties = useMemo(() => {
        let result = [...allProperties];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.location.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (selectedType !== 'all') {
            result = result.filter((p) => p.type === selectedType);
        }

        // Price range filter
        if (priceRange.min) {
            result = result.filter((p) => p.price >= parseInt(priceRange.min));
        }
        if (priceRange.max) {
            result = result.filter((p) => p.price <= parseInt(priceRange.max));
        }

        // Rating filter
        if (minRating > 0) {
            result = result.filter((p) => p.rating >= minRating);
        }

        // Sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Keep recommended order
                break;
        }

        return result;
    }, [searchQuery, selectedType, priceRange, minRating, sortBy]);

    const clearFilters = () => {
        setSelectedType('all');
        setPriceRange({ min: '', max: '' });
        setMinRating(0);
        setSortBy('recommended');
        setSearchQuery('');
    };

    const hasActiveFilters =
        selectedType !== 'all' ||
        priceRange.min ||
        priceRange.max ||
        minRating > 0 ||
        searchQuery;

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-4">
                        <Link to="/" className="hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-neutral-700 font-medium">Browse PGs</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                                Browse Properties
                            </h1>
                            <p className="text-neutral-500 mt-1">
                                {filteredProperties.length} properties available
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="lg:w-96">
                            <SearchBar
                                onSearch={(query) => setSearchQuery(query)}
                                variant="default"
                            />
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hidden lg:block w-72 flex-shrink-0"
                    >
                        <div className="card p-6 sticky top-28">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-display font-bold text-neutral-800">
                                    Filters
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Property Type */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                    Property Type
                                </h3>
                                <div className="space-y-2">
                                    {propertyTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center space-x-3 cursor-pointer group"
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedType === type.value
                                                    ? 'bg-primary-600 border-primary-600'
                                                    : 'border-neutral-300 group-hover:border-primary-400'
                                                    }`}
                                            >
                                                {selectedType === type.value && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-neutral-600 group-hover:text-neutral-800 transition-colors">
                                                {type.label}
                                            </span>
                                        </label>
                                    ))}
                                    <input
                                        type="hidden"
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        value={selectedType}
                                    />
                                    {propertyTypes.map((type) => (
                                        <input
                                            key={type.value}
                                            type="radio"
                                            name="propertyType"
                                            value={type.value}
                                            checked={selectedType === type.value}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="sr-only"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                    Price Range
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) =>
                                            setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                                        }
                                        className="input-field text-sm py-2"
                                    />
                                    <span className="text-neutral-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) =>
                                            setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                                        }
                                        className="input-field text-sm py-2"
                                    />
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                    Minimum Rating
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating)}
                                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${minRating === rating
                                                ? 'bg-primary-600 text-white shadow-button'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {rating === 0 ? 'Any' : `${rating}+`}
                                            {rating > 0 && (
                                                <svg
                                                    className="w-3.5 h-3.5 inline ml-1 text-amber-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort & Mobile Filter Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-card"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-neutral-100 rounded-xl text-neutral-700 hover:bg-neutral-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="font-medium">Filters</span>
                                    {hasActiveFilters && (
                                        <span className="w-2 h-2 bg-primary-500 rounded-full" />
                                    )}
                                </button>

                                <span className="hidden md:inline text-neutral-500 text-sm">
                                    Showing {filteredProperties.length} results
                                </span>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center space-x-2">
                                <span className="text-neutral-500 text-sm hidden sm:inline">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-neutral-100 text-neutral-700 font-medium px-4 py-2 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        {/* Property Grid */}
                        {filteredProperties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProperties.map((property, index) => (
                                    <motion.div
                                        key={property.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <PropertyCard property={property} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card p-12 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">
                                    No Properties Found
                                </h3>
                                <p className="text-neutral-500 mb-6">
                                    Try adjusting your filters or search criteria
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn-primary"
                                >
                                    Clear All Filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Bottom Sheet */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                {/* Handle */}
                                <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6" />

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-display font-bold text-neutral-800">
                                        Filters
                                    </h2>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Property Type */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                        Property Type
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {propertyTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => setSelectedType(type.value)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type.value
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                        Price Range
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) =>
                                                setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                                            }
                                            className="input-field text-sm"
                                        />
                                        <span className="text-neutral-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) =>
                                                setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                                            }
                                            className="input-field text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                        Minimum Rating
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[0, 3, 3.5, 4, 4.5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setMinRating(rating)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${minRating === rating
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 btn-secondary"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="flex-1 btn-primary"
                                    >
                                        Show {filteredProperties.length} Results
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Browse;
