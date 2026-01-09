import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { propertyAPI } from '../utils/api';
import { updateMetaTags, pageSEO } from '../utils/seo';
const Browse = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const campusParam = searchParams.get('campus') || searchParams.get('college') || '';
    
    // Use campus parameter if available, otherwise use search parameter
    const [searchQuery, setSearchQuery] = useState(campusParam || initialSearch);
    const [selectedType, setSelectedType] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('recommended');
    const [showFilters, setShowFilters] = useState(false);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        updateMetaTags(pageSEO.browse);
    }, []);

    // Update search query when URL parameters change
    useEffect(() => {
        const newCampusParam = searchParams.get('campus') || searchParams.get('college') || '';
        const newSearchParam = searchParams.get('search') || '';
        const newQuery = newCampusParam || newSearchParam;
        
        if (newQuery && newQuery !== searchQuery) {
            setSearchQuery(newQuery);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedType !== 'all') {
                    // Map UI labels to database gender field
                    if (selectedType === 'Boys PG') {
                        params.gender = 'male';
                    } else if (selectedType === 'Girls PG') {
                        params.gender = 'female';
                    } else {
                        params.gender = 'any';
                    }
                }
                
                const response = await propertyAPI.getAllProperties(params);
                if (response.success) {
                    setProperties(response.data.properties || []);
                }
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message || 'Failed to fetch properties');
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [selectedType, searchQuery]);
    const propertyTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'Boys PG', label: 'Boys PG' },
        { value: 'Girls PG', label: 'Girls PG' },
        { value: 'Co-Living', label: 'Co-Living' },
        { value: 'Hostel', label: 'Hostel' },
    ];
    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
    ];
    const filteredProperties = useMemo(() => {
        let result = [...properties];
        // Backend already handles search filtering, so we skip it here
        // Only apply filters that aren't sent to backend
        if (selectedType !== 'all') {
            // Map UI labels to database gender field
            let genderFilter;
            if (selectedType === 'Boys PG') {
                genderFilter = 'male';
            } else if (selectedType === 'Girls PG') {
                genderFilter = 'female';
            } else {
                genderFilter = 'any'; // Co-Living, Hostel, etc.
            }
            result = result.filter((p) => p.gender === genderFilter);
        }
        if (minRating > 0) {
            result = result.filter((p) => (p.rating || 0) >= minRating);
        }
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }
        return result;
    }, [properties, selectedType, minRating, sortBy]);
    const clearFilters = () => {
        setSelectedType('all');
        setMinRating(0);
        setSortBy('recommended');
        setSearchQuery('');
        window.history.pushState({}, '', '/browse');
    };
    const hasActiveFilters =
        selectedType !== 'all' ||
        minRating > 0 ||
        searchQuery;
    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24">
            <div className="container mx-auto px-4">
                {}
                <div className="mb-8">

                    {}
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
                                {loading ? 'Loading...' : `${filteredProperties.length} properties available`}
                            </p>
                        </div>
                        {}
                        <div className="lg:w-96">
                            <SearchBar variant="default" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    {}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
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
                            {}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                                    Property Type
                                </h3>
                                <div className="space-y-2">
                                    {propertyTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center space-x-3 cursor-pointer group"
                                            onClick={() => setSelectedType(type.value)}
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
                                            <input
                                                type="radio"
                                                name="propertyType"
                                                value={type.value}
                                                checked={selectedType === type.value}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                className="sr-only"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {}
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
                    </aside>
                    {}
                    <div className="flex-1">
                        {}
                        <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-card">
                            <div className="flex items-center space-x-3">
                                {}
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
                            {}
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
                        </div>
                        {}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="card overflow-hidden animate-pulse">
                                        <div className="h-48 bg-neutral-200"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                                            <div className="h-3 bg-neutral-200 rounded w-3/4 mb-4"></div>
                                            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="card p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">
                                    Error Loading Properties
                                </h3>
                                <p className="text-neutral-500 mb-6">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn-primary"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredProperties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <div key={property._id || property.id}>
                                        <PropertyCard property={property} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-neutral-800 mb-2">
                                    No Properties Found
                                </h3>
                                <p className="text-neutral-500 mb-6">
                                    Try adjusting your filters or search criteria
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="btn-primary"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {}
            {showFilters && (
                <>
                    {}
                    <div
                        onClick={() => setShowFilters(false)}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    />
                    {}
                    <div className="fixed bottom-20 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[70vh] overflow-y-auto transition-transform duration-300">
                            <div className="p-6">
                                {}
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
                                {}
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
                                {}
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
                                {}
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
                        </div>
                    </>
                )}
        </div>
    );
};
export default Browse;
