import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { propertyAPI } from '../utils/api';
import { updateMetaTags, pageSEO, generateFAQStructuredData, addStructuredData } from '../utils/seo';
const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const faqs = [
        {
            question: 'How do I find PG near my college?',
            answer: 'Use our search bar to enter your college name or location. You can filter by price, amenities, room type, and gender preference to find the perfect PG accommodation near your college.'
        },
        {
            question: 'Are all PG listings verified?',
            answer: 'Yes, we verify all property owners and conduct property checks to ensure authenticity. However, we always recommend visiting the property in person before making a final decision.'
        },
        {
            question: 'What is the average rent for PG near colleges?',
            answer: 'PG rents vary by location and amenities. On average, single rooms start from ₹4,500/month, double sharing from ₹3,500/month, and triple sharing from ₹3,000/month. Prices may vary based on location and facilities.'
        },
        {
            question: 'Do I need to pay a security deposit?',
            answer: 'Most PG accommodations require a security deposit, typically equal to 1-2 months rent. This is refundable when you vacate the property, subject to no damages.'
        },
        {
            question: 'What amenities are included in PG?',
            answer: 'Common amenities include WiFi, meals, laundry, housekeeping, AC/cooler, and 24/7 security. Specific amenities vary by property and are clearly listed on each PG profile.'
        },
        {
            question: 'How do I contact the property owner?',
            answer: 'Create a free account on Unirooms, browse properties, and click "Contact Owner" on any listing to get the owner\'s phone number and contact details.'
        },
        {
            question: 'Is there a difference between Boys PG and Girls PG?',
            answer: 'Boys PG and Girls PG refer to gender-specific accommodations. Some properties are exclusive for boys or girls, while co-living spaces accept both genders with separate floors or sections.'
        },
        {
            question: 'Can I cancel my PG booking?',
            answer: 'Cancellation policies vary by property. Always read the rental agreement carefully and discuss cancellation terms with the owner before booking. Most owners require 30 days notice.'
        }
    ];
    useEffect(() => {
        updateMetaTags(pageSEO.home);
        const faqSchema = generateFAQStructuredData(faqs);
        addStructuredData(faqSchema);
    }, []);
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 overflow-x-hidden">
            {}
            <section className="relative min-h-[50vh] md:min-h-[90vh] flex items-center pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500">
                {}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="relative z-10 container mx-auto pt-5 px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6 border border-white/30 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                Trusted by Students
                            </span>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                                Find Your Perfect
                                <span className="text-blue-100"> PG </span>
                                <span className="block sm:inline">Near University</span>
                            </h1>
                            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8">
                                Discover verified, affordable PG accommodations within walking distance of your university. Your comfort, our priority.
                            </p>
                            {}
                            <SearchBar variant="hero" />
                            {}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-all">
                                        <p className="text-2xl md:text-3xl font-display font-bold text-white">{stat.value}</p>
                                        <p className="text-white/80 text-xs md:text-sm mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        {}
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
                                            alt="Modern PG room near college with comfortable bed and study area"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-card h-64">
                                        <img
                                            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                                            alt="Spacious living area in student PG accommodation"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-card h-64">
                                        <img
                                            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
                                            alt="Affordable PG accommodation near university"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-card h-48 relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
                                            alt="Cozy and comfortable PG room for students"
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
                    </div>
                </div>
            </section>
            {}
            <section className="pt-16 pb-20 bg-gradient-to-br from-neutral-50 via-white to-blue-50/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <div>
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-full text-sm font-semibold uppercase tracking-wider">
                                ⭐ Featured
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mt-4">
                                PGs Near You
                            </h2>
                            <p className="text-neutral-600 mt-2 max-w-lg">
                                Accommodations verified for quality and safety
                            </p>
                        </div>
                        <Link
                            to="/browse"
                            className="mt-6 md:mt-0 inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all group"
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
                        <>
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
                        
                        {/* Browse More Link */}
                        <div className="text-center mt-12">
                            <Link
                                to="/browse"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/30 transition-all transform hover:scale-105"
                            >
                                <span>Browse More PGs</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        </>
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
            {/* Popular College Locations Section */}
            <section className="py-16 bg-gradient-to-br from-neutral-50 to-blue-50/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            🎓 Top Colleges
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
                            Find PG Near Top Colleges
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            Browse verified PG accommodations near India's premier educational institutions
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { name: 'VIT Bhopal', slug: 'vit-bhopal', location: 'Bhopal, MP', gradient: 'from-blue-500 to-cyan-500' },
                            { name: 'VIT Vellore', slug: 'vit-vellore', location: 'Vellore, TN', gradient: 'from-purple-500 to-pink-500' },
                            { name: 'VIT Chennai', slug: 'vit-chennai', location: 'Chennai, TN', gradient: 'from-green-500 to-teal-500' },
                            { name: 'SRM University', slug: 'srm-university', location: 'Chennai, TN', gradient: 'from-orange-500 to-red-500' },
                            { name: 'IIT Delhi', slug: 'iit-delhi', location: 'New Delhi', gradient: 'from-indigo-500 to-blue-500' },
                            { name: 'IIT Bombay', slug: 'iit-bombay', location: 'Mumbai, MH', gradient: 'from-pink-500 to-rose-500' },
                        ].map((college) => (
                            <Link
                                key={college.slug}
                                to={`/college/${college.slug}`}
                                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-transparent"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${college.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${college.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                                        PG Near {college.name}
                                    </h3>
                                    <p className="text-neutral-600 text-sm mb-4">
                                        📍 {college.location}
                                    </p>
                                    <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                                        View Properties
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            {}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-full text-sm font-semibold uppercase tracking-wider">
                            ✨ Why Us
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mt-4">
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
                                className="bg-white rounded-3xl p-8 text-center group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 border border-neutral-100 hover:border-primary-200 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                                    feature.color === 'primary' ? 'bg-gradient-to-br from-primary-500 to-blue-500 shadow-lg shadow-primary-500/30' :
                                    feature.color === 'accent' ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30' :
                                    'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                                } text-white group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-lg">
                        Ready to Find Your<br />Perfect PG?
                    </h2>
                    <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of students who found their ideal accommodation through Unirooms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/browse" className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                            Browse Properties
                        </Link>
                        <Link to="/signup" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
            {}
            <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-blue-50/20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            ❓ FAQ
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-neutral-600">
                            Everything you need to know about finding PG accommodation near your college
                        </p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.details
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 cursor-pointer group hover:shadow-xl hover:shadow-primary-500/5 transition-all border border-neutral-100"
                            >
                                <summary className="font-semibold text-neutral-800 flex items-center justify-between group-hover:text-primary-600 transition-colors">
                                    {faq.question}
                                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p className="mt-4 text-neutral-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>
            {}
            <div className="h-20 md:h-0" />
        </div>
    );
};
export default Home;
