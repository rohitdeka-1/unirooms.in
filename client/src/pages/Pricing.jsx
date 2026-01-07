import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-24 md:pb-12 mt-7">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Students browse and contact landlords for <strong className="text-green-600">FREE</strong>. Landlords pay a one-time fee to list their properties.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                    {/* For Students - FREE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="card p-8 text-center border-2 border-green-500 relative overflow-hidden h-full">
                            {/* Badge */}
                            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                For Students
                            </div>

                            <div className="mb-6 mt-4">
                                <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                    Browse & Connect
                                </h2>
                                <p className="text-neutral-600">
                                    Find your perfect PG
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-5xl font-display font-bold text-green-600">FREE</span>
                                </div>
                                <p className="text-neutral-500">Forever. No hidden charges.</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-8 text-left">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Browse unlimited properties</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">View complete property details</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Access landlord contact information</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Save favorite properties</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Contact multiple landlords</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">No payment required ever</span>
                                </div>
                            </div>

                            <Link to="/browse" className="btn-primary bg-green-600 hover:bg-green-700 w-full text-center block">
                                Start Browsing
                            </Link>
                        </div>
                    </motion.div>

                    {/* For Landlords - ₹99 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="card p-8 text-center border-2 border-primary-500 relative overflow-hidden h-full">
                            {/* Badge */}
                            <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                For Landlords
                            </div>

                            <div className="mb-6 mt-4">
                                <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                                    Property Listing
                                </h2>
                                <p className="text-neutral-600">
                                    Reach thousands of students
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-5xl font-display font-bold text-neutral-800">₹99</span>
                                </div>
                                <p className="text-neutral-500">One-time fee per property</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-8 text-left">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">List your property on platform</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Upload photos and details</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Students contact you for FREE</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Manage from dashboard</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Active until property rented</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-neutral-700">Direct communication with students</span>
                                </div>
                            </div>

                            <Link to="/list-property" className="btn-primary w-full text-center block">
                                List Your Property
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-6xl mx-auto mb-12"
                >
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-8 text-center">
                        How It Works
                    </h2>
                    
                    {/* For Students */}
                    <div className="mb-10">
                        <h3 className="text-xl font-semibold text-green-600 text-center mb-6">For Students (FREE)</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-green-600">1</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Browse Properties</h4>
                                <p className="text-sm text-neutral-600">
                                    Search through verified PG listings near your university
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-green-600">2</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">View Complete Details</h4>
                                <p className="text-sm text-neutral-600">
                                    See photos, amenities, pricing, and landlord contact info
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-green-600">3</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Contact Directly</h4>
                                <p className="text-sm text-neutral-600">
                                    Call or message landlord directly - no payment needed!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 my-8"></div>

                    {/* For Landlords */}
                    <div>
                        <h3 className="text-xl font-semibold text-primary-600 text-center mb-6">For Landlords (₹99 per listing)</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">1</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Create Account</h4>
                                <p className="text-sm text-neutral-600">
                                    Sign up as a landlord - quick and easy registration
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">2</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Pay ₹99 & List</h4>
                                <p className="text-sm text-neutral-600">
                                    One-time payment to publish your property with all details
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary-600">3</span>
                                </div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Get Contacted</h4>
                                <p className="text-sm text-neutral-600">
                                    Students reach out directly to arrange visits and bookings
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                Is it really free for students?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                Yes! Students can browse all properties, view complete details including landlord contact information, and reach out to landlords completely FREE. There are no hidden charges, no subscriptions, and no payment required at any step.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                Why do landlords pay ₹99?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                The ₹99 is a one-time listing fee that helps us maintain the platform, verify properties, and connect landlords with genuine students. It's a small investment to reach thousands of students actively looking for accommodation.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                Do I pay ₹99 for each property I list?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                Yes. The ₹99 fee is charged per property listing. Each property you want to list on Unirooms requires a one-time payment. Your listing remains active until the property is rented.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                Is the ₹99 listing fee refundable?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                The listing fee is non-refundable once your property is published. However, refunds may be considered in exceptional cases like technical errors. Please review our <Link to="/refund-policy" className="text-primary-600 hover:text-primary-700">Refund Policy</Link> for complete details.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Digital Wallets through our secure payment gateway partners.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-neutral-800 mb-2">
                                Is my payment secure?
                            </h3>
                            <p className="text-neutral-600 text-sm">
                                Absolutely. All payments are processed through secure, PCI-DSS compliant payment gateways. We do not store your card details on our servers.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto mt-12"
                >
                    <div className="card p-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200 text-center">
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            Students: Browse for free. Landlords: List your property and reach thousands of students.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/browse" className="btn-primary bg-green-600 hover:bg-green-700">
                                Browse Properties (FREE)
                            </Link>
                            <Link to="/list-property" className="btn-primary">
                                List Property (₹99)
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
