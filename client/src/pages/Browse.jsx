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
    
    const [searchQuery, setSearchQuery] = useState(campusParam || initialSearch);
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('recommended');
    const [showFilters, setShowFilters] = useState(false);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperties, setTotalProperties] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const PROPERTIES_PER_PAGE = 20;

    useEffect(() => {
        updateMetaTags(pageSEO.browse);
    }, []);

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
                const params = {
                    page: currentPage,
                    limit: PROPERTIES_PER_PAGE
                };
                if (searchQuery) params.search = searchQuery;
                if (selectedType !== 'all') {
                    params.gender = selectedType;
                }
                
                const response = await propertyAPI.getAllProperties(params);
                if (response.success) {
                    setProperties(response.data.properties || []);
                    setTotalProperties(response.data.pagination?.total || 0);
                    setTotalPages(response.data.pagination?.pages || 1);
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
    }, [selectedType, searchQuery, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, searchQuery]);

    const propertyTypes = [
        { value: 'all', label: 'All Types', icon: '🏠', color: 'from-blue-500 to-indigo-500' },
        { value: 'male', label: 'Boys PG', icon: '👨', color: 'from-sky-500 to-blue-500' },
        { value: 'female', label: 'Girls PG', icon: '👩', color: 'from-pink-500 to-rose-500' },
        { value: 'any', label: 'Co-ed', icon: '👥', color: 'from-violet-500 to-purple-500' },
    ];

    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
    ];

    const filteredProperties = useMemo(() => {
        let result = [...properties];
        
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        return result;
    }, [properties, sortBy]);

    const clearFilters = () => {
        setSelectedType('all');
        setSortBy('recommended');
        setSearchQuery('');
        window.history.pushState({}, '', '/browse');
    };

    const hasActiveFilters = selectedType !== 'all' || searchQuery;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
            {/* Hero Header Section */}
            <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-blue-500 pt-28 sm:pt-32 pb-16 sm:pb-20">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb - Hidden on mobile */}
                    <div className="hidden sm:flex items-center space-x-2 text-sm text-white/80 mb-6">
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white font-medium">Browse PGs</span>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
                        <div className="text-white text-center sm:text-left">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-2 sm:mb-3 drop-shadow-lg">
                                Find Your Perfect PG
                            </h1>
                            <p className="text-white/90 text-sm sm:text-lg flex items-center justify-center sm:justify-start gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full backdrop-blur-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </span>
                                {loading ? 'Searching...' : `${totalProperties} properties available`}
                            </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="w-full lg:w-[420px] relative z-[100]">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-xl shadow-blue-900/20">
                                <SearchBar variant="default" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="container mx-auto px-4 -mt-8 relative z-100 mb-2">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    {propertyTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setSelectedType(type.value)}
                            className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
                                selectedType === type.value
                                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg shadow-blue-500/25`
                                    : 'bg-white text-neutral-700 shadow-md hover:shadow-lg border border-neutral-100'
                            }`}
                        >
                            <span className="text-base sm:text-lg">{type.icon}</span>
                            <span>{type.label}</span>
                            {selectedType === type.value && (
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-24 mt-10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar Filter - Desktop */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {/* Filter Card */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-500 to-blue-500 p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                            </div>
                                            <span className="font-display font-bold text-lg">Filters</span>
                                        </div>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-white/90 hover:text-white font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="px-6 py-3">
                                    <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                                        Property Type
                                    </h3>
                                    <div className="space-y-2">
                                        {propertyTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                onClick={() => setSelectedType(type.value)}
                                                className={`flex items-center gap-4 p-1 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    selectedType === type.value
                                                        ? 'bg-primary-50 border-2 '
                                                        : 'border-2 border-transparent hover:bg-neutral-50'
                                                }`}
                                            >
                                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                                    selectedType === type.value
                                                        ? `bg-gradient-to-r ${type.color} shadow-md`
                                                        : 'bg-neutral-100'
                                                }`}>
                                                    {type.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <span className={`font-medium ${
                                                        selectedType === type.value ? 'text-primary-700' : 'text-neutral-700'
                                                    }`}>
                                                        {type.label}
                                                    </span>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    selectedType === type.value
                                                        ? 'bg-primary-500 '
                                                        : 'border-neutral-300'
                                                }`}>
                                                    {selectedType === type.value && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
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
                            </div>

                            {/* Stats Card */}
                            <div className="bg-gradient-to-br from-accent-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Available Now</p>
                                        <p className="text-2xl font-bold">{totalProperties}+ PGs</p>
                                    </div>
                                </div>
                                <p className="text-white/90 text-sm">
                                    New properties added every day. Find your perfect stay today!
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Results Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6  bg-white rounded-2xl p-2 shadow-lg shadow-neutral-100 border border-neutral-100">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span>Filters</span>
                                    {hasActiveFilters && (
                                        <span className="w-5 h-5 bg-white text-primary-600 rounded-full text-xs font-bold flex items-center justify-center">
                                            1
                                        </span>
                                    )}
                                </button>
                                <div className="hidden md:flex items-center gap-2 text-neutral-600">
                                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>
                                        Showing <span className="font-semibold text-neutral-800">{filteredProperties.length}</span> of <span className="font-semibold text-neutral-800">{totalProperties}</span> results
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-neutral-500 text-sm hidden sm:inline">Sort by:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-neutral-100 text-neutral-700 font-medium pl-4 pr-10 py-2.5 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer transition-all hover:bg-neutral-200"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Property Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 animate-pulse">
                                        <div className="h-52 bg-gradient-to-br from-neutral-200 to-neutral-100" />
                                        <div className="p-5">
                                            <div className="h-5 bg-neutral-200 rounded-lg mb-3 w-3/4" />
                                            <div className="h-4 bg-neutral-100 rounded-lg mb-4 w-1/2" />
                                            <div className="flex justify-between items-center">
                                                <div className="h-6 bg-neutral-200 rounded-lg w-24" />
                                                <div className="h-8 bg-neutral-100 rounded-lg w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-neutral-100">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-neutral-800 mb-3">
                                    Oops! Something went wrong
                                </h3>
                                <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn-primary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Try Again
                                </button>
                            </div>
                        ) : filteredProperties.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredProperties.map((property, index) => (
                                        <div 
                                            key={property._id || property.id}
                                            className="transform transition-all duration-300 hover:-translate-y-1"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <PropertyCard property={property} />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`w-12 h-12 rounded-xl font-medium transition-all flex items-center justify-center ${
                                                currentPage === 1
                                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 shadow-md border border-neutral-100'
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        
                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const pages = [];
                                                const showEllipsisStart = currentPage > 3;
                                                const showEllipsisEnd = currentPage < totalPages - 2;
                                                
                                                pages.push(1);
                                                
                                                if (showEllipsisStart) {
                                                    pages.push('...');
                                                }
                                                
                                                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                                    if (!pages.includes(i)) {
                                                        pages.push(i);
                                                    }
                                                }
                                                
                                                if (showEllipsisEnd) {
                                                    pages.push('...');
                                                }
                                                
                                                if (totalPages > 1 && !pages.includes(totalPages)) {
                                                    pages.push(totalPages);
                                                }
                                                
                                                return pages.map((page, idx) => (
                                                    page === '...' ? (
                                                        <span key={`ellipsis-${idx}`} className="px-3 text-neutral-400">...</span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                                                                currentPage === page
                                                                    ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 shadow-md border border-neutral-100'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ));
                                            })()}
                                        </div>
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`w-12 h-12 rounded-xl font-medium transition-all flex items-center justify-center ${
                                                currentPage === totalPages
                                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 shadow-md border border-neutral-100'
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-neutral-100">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-neutral-800 mb-3">
                                    No Properties Found
                                </h3>
                                <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                    We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="btn-primary"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showFilters && (
                <>
                    <div
                        onClick={() => setShowFilters(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto shadow-2xl transition-transform duration-300">
                        <div className="p-6">
                            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-6" />
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-neutral-800 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
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
                            
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                                    Property Type
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {propertyTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setSelectedType(type.value)}
                                            className={`flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${
                                                selectedType === type.value
                                                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                        >
                                            <span className="text-xl">{type.icon}</span>
                                            <span>{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 btn-secondary py-4"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 btn-primary py-4"
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
