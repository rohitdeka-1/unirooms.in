import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 mt-7 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
                        About Unirooms
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Connecting students with trusted accommodation near their universities
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Our Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            Our Story
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Unirooms was founded with a simple mission: to make finding student accommodation easier, safer, and more transparent. We understand the challenges students face when searching for PG accommodations near their universities – the endless searching, the uncertainty about landlords, and the difficulty in finding verified listings.
                        </p>
                        <p className="text-neutral-600">
                            As a trusted platform, we connect students directly with property owners in their preferred areas, making the search process seamless and stress-free. We're not just a listing platform; we're your companion in finding the perfect home away from home.
                        </p>
                    </motion.div>

                    {/* What We Do */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            What We Do
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Unirooms serves as a bridge between students seeking accommodation and property owners offering PG facilities. We provide:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-neutral-600">
                                    <strong className="text-neutral-800">Direct Contact Information:</strong> Get verified contact details of property owners in your preferred area
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-neutral-600">
                                    <strong className="text-neutral-800">Comprehensive Listings:</strong> Browse detailed property information including amenities, pricing, and location
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-neutral-600">
                                    <strong className="text-neutral-800">Easy Search:</strong> Filter by location, budget, amenities, and more to find your ideal accommodation
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-neutral-600">
                                    <strong className="text-neutral-800">Transparent Platform:</strong> Free for students to browse and contact landlords. Landlords pay a one-time listing fee of ₹99 per property
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* How It Works */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                            How It Works
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">1</span>
                                </div>
                                <h3 className="font-semibold text-neutral-800 mb-2">Browse Listings</h3>
                                <p className="text-sm text-neutral-600">
                                    Search and filter properties near your university
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">2</span>
                                </div>
                                <h3 className="font-semibold text-neutral-800 mb-2">Contact Landlords</h3>
                                <p className="text-sm text-neutral-600">
                                    View details and contact landlords for FREE
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">3</span>
                                </div>
                                <h3 className="font-semibold text-neutral-800 mb-2">Connect Directly</h3>
                                <p className="text-sm text-neutral-600">
                                    Contact landlords and finalize your accommodation
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Our Role */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-8 bg-primary-50 border-primary-200"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            We Are a Mediator
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong className="text-neutral-800">Important:</strong> Unirooms acts as a connecting platform between students and property owners. We provide verified contact information and facilitate initial connections, but we are not responsible for:
                        </p>
                        <ul className="space-y-2 text-neutral-600">
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-600">•</span>
                                <span>Property condition, amenities, or services provided by landlords</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-600">•</span>
                                <span>Rental agreements, disputes, or financial transactions between students and landlords</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-primary-600">•</span>
                                <span>Any issues that arise after contact information is shared</span>
                            </li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            We encourage all users to verify property details, visit locations in person, and read all agreements carefully before making any commitments.
                        </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center pt-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            Ready to Find Your Perfect PG?
                        </h2>
                        <Link to="/browse" className="btn-primary inline-block">
                            Browse Properties
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
