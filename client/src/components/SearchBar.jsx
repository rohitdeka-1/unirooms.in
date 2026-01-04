import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../utils/api';

const SearchBar = ({ onSearch, variant = 'default' }) => {
    const [location, setLocation] = useState('');
    const [collegeSuggestions, setCollegeSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchingCollege, setIsSearchingCollege] = useState(false);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search colleges as user types
    useEffect(() => {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Don't search if query is too short
        if (location.trim().length < 2) {
            setCollegeSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Debounce the search
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setIsSearchingCollege(true);
                const response = await propertyAPI.searchColleges(location);
                if (response.success) {
                    setCollegeSuggestions(response.data.colleges || []);
                    setShowSuggestions(response.data.colleges.length > 0);
                }
            } catch (error) {
                console.error('Error searching colleges:', error);
                setCollegeSuggestions([]);
            } finally {
                setIsSearchingCollege(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(location);
        } else {
            navigate(`/browse?search=${encodeURIComponent(location)}`);
        }
        setShowSuggestions(false);
    };

    const handleCollegeSelect = (college) => {
        const searchTerm = college.shortName || college.name;
        setLocation(searchTerm);
        setShowSuggestions(false);
        
        // Navigate to browse page with college filter
        navigate(`/browse?college=${encodeURIComponent(searchTerm)}`);
    };

    const handlePopularClick = (place) => {
        setLocation(place);
        // Trigger search for popular colleges
        navigate(`/browse?college=${encodeURIComponent(place)}`);
    };

    const isHero = variant === 'hero';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl relative"
            ref={suggestionsRef}
        >
            <form onSubmit={handleSearch}>
                <div className={`relative flex items-center ${isHero ? 'bg-white rounded-2xl p-2 shadow-lg border border-neutral-200' : 'bg-white rounded-xl shadow-card'}`}>
                    {/* Location Icon */}
                    {/* <div className={`flex items-center ${isHero ? 'pl-4' : 'pl-5'}`}>
                        <div className={`${isHero ? 'w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl' : 'w-10 h-10 bg-primary-50 rounded-lg'} flex items-center justify-center`}>
                            <svg className={`${isHero ? 'w-6 h-6 text-white' : 'w-5 h-5 text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div> */}

                    <div className="flex-1 px-4">
                        <input
                            type="text"
                            placeholder="Search for PG near your college..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onFocus={() => {
                                if (collegeSuggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            className={`w-full bg-transparent outline-none ${isHero ? 'text-neutral-700 placeholder-neutral-400 text-lg py-4' : 'text-neutral-700 placeholder-neutral-400 py-3'}`}
                        />
                    </div>

                    <div className={` ${isHero ? 'pr-2' : 'pr-3'}`}   >
                        <button
                            type="submit"
                            className={`${isHero ? 'px-5 py-4' : 'px-4 py-3'} btn-accent rounded-full flex items-center space-x-2`}
                        >
                            {isSearchingCollege ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* College Suggestions Dropdown */}
                {showSuggestions && collegeSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 max-h-80 overflow-y-auto"
                    >
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase">
                                Colleges Found
                            </div>
                            {collegeSuggestions.map((college, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleCollegeSelect(college)}
                                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-neutral-800 truncate">
                                                {college.shortName || college.name}
                                            </div>
                                            <div className="text-sm text-neutral-500 truncate">
                                                {college.address.city}, {college.address.state}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </form>

            {/* Popular Searches */}
            {isHero && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center gap-2 mt-4"
                >
                    <span className="text-neutral-500 text-sm">Popular:</span>
                    {['VIT Bhopal', 'VIT Chennai', 'VIT Vellore', "SRM University"].map((place) => (
                        <button
                            key={place}
                            type="button"
                            onClick={() => handlePopularClick(place)}
                            className="px-3 py-1.5 bg-neutral-100 text-neutral-600 text-sm rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                            {place}
                        </button>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default SearchBar;
