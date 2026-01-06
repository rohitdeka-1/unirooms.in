import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { propertyAPI } from '../utils/api';

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch real properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await propertyAPI.getAllProperties({ limit: 8 });
                if (response.success) {
                    setFeaturedProperties(response.data.properties || []);
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
                setFeaturedProperties([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const stats = [
        { value: '5', label: 'Verified PGs' },
        { value: '10', label: 'Happy Students' },
        { value: '5', label: 'College Areas' },
        { value: '4.8', label: 'Avg Rating' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
            {/* Hero Section - Clean Airbnb Style */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-white">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100/30 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6 border border-primary-100">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
                                Trusted by Students
                            </span>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-4 md:mb-6 leading-tight">
                                Find Your Perfect
                                <span className="text-primary-600"> PG </span>
                                <span className="block sm:inline">Near University</span>
                            </h1>

                            <p className="text-base md:text-lg text-neutral-600 mb-6 md:mb-8">
                                Discover verified, affordable PG accommodations within walking distance of your university. Your comfort, our priority.
                            </p>

                            {/* Search Bar */}
                            <SearchBar variant="hero" />

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-left">
                                        <p className="text-xl md:text-3xl font-display font-bold text-neutral-900">{stat.value}</p>
                                        <p className="text-neutral-500 text-xs md:text-sm">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Hero Image Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-card h-48">
                                        <img
                                            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
                                            alt="PG Room"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-card h-64">
                                        <img
                                            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                                            alt="Living Space"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-card h-64">
                                        <img
                                            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
                                            alt="Modern Room"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-card h-48 relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
                                            alt="Cozy Space"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent flex items-end p-4">
                                            <div className="text-white">
                                                <p className="font-semibold">500+ Verified PGs</p>
                                                <p className="text-sm text-white/80">Near top universities</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile Image Showcase - Only visible on mobile/tablet */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="lg:hidden mt-8 overflow-hidden"
                        >
                            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                {[
                                    { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', label: 'Boys PG', price: '₹4,500/mo' },
                                    { img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', label: 'Girls PG', price: '₹4,500/mo' },
                                    { img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', label: 'Co-Living', price: '₹7,000/mo' },
                                ].map((item, index) => (
                                    <div key={index} className="flex-shrink-0 w-56 snap-start first:ml-0 last:mr-0">
                                        <div className="rounded-2xl overflow-hidden shadow-card h-36 relative">
                                            <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                                <p className="font-semibold text-sm">{item.label}</p>
                                                <p className="text-xs text-white/80">From {item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-neutral-400 text-xs mt-1">← Swipe to explore →</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured PGs */}
            <section className="py-20 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <div>
                            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Featured</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mt-2">
                                PGs Near You
                            </h2>
                            <p className="text-neutral-500 mt-2 max-w-lg">
                                Handpicked accommodations verified for quality and safety
                            </p>
                        </div>
                        <Link
                            to="/browse"
                            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 group"
                        >
                            <span>View All Properties</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-neutral-200 rounded-2xl h-96"></div>
                                </div>
                            ))}
                        </div>
                    ) : featuredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredProperties.map((property, index) => (
                                <motion.div
                                    key={property._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <PropertyCard property={property} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Properties Yet</h3>
                            <p className="text-neutral-500 mb-6">Be the first to list a property!</p>
                            <Link to="/landlord/add-property" className="btn-primary inline-flex">
                                List Your Property
                            </Link>
                        </div>
                    )}
                </div>
            </section>


            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why Us</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mt-2">
                            Why Choose Unirooms?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                ),
                                title: 'Verified Listings',
                                description: 'Every PG is personally verified for safety, hygiene, and authenticity.',
                                color: 'primary',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                ),
                                title: 'Near Colleges',
                                description: 'Find PGs within walking distance, saving time and commute hassle.',
                                color: 'accent',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                title: 'Best Prices',
                                description: 'Affordable options for every budget with transparent pricing.',
                                color: 'green',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-8 text-center group hover:shadow-card-hover"
                            >
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                                    feature.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                                        'bg-green-100 text-green-600'
                                    } group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-neutral-800 mb-3">{feature.title}</h3>
                                <p className="text-neutral-500">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Ready to Find Your<br />Perfect PG?
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of students who found their ideal accommodation through Unirooms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/properties" className="btn-accent">
                            Browse
                        </Link>
                        <Link to="/signup" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bottom padding for mobile nav */}
            <div className="h-20 md:h-0" />
        </div>
    );
};

export default Home;
