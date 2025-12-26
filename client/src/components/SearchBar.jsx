import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, variant = 'default' }) => {
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(location);
        } else {
            navigate(`/properties?search=${encodeURIComponent(location)}`);
        }
    };

    const isHero = variant === 'hero';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl"
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

                    {/* Input */}
                    <div className="flex-1 px-4">
                        <input
                            type="text"
                            placeholder="Search for PG near your college..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={`w-full bg-transparent outline-none ${isHero ? 'text-neutral-700 placeholder-neutral-400 text-lg py-4' : 'text-neutral-700 placeholder-neutral-400 py-3'}`}
                        />
                    </div>

                    {/* Search Button */}
                    <div className={` ${isHero ? 'pr-2' : 'pr-3'}`}   >
                        <button
                            type="submit"
                            className={`${isHero ? 'px-5 py-4' : 'px-4 py-3'} btn-accent rounded-full flex items-center space-x-2`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
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
                            onClick={() => setLocation(place)}
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
