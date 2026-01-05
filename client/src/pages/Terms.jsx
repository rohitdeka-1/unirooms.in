import { motion } from 'framer-motion';

const Terms = () => {
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-neutral-600">
                        Last updated: January 5, 2026
                    </p>
                </motion.div>

                {/* Content */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            By accessing and using Unirooms ("Platform", "Service", "we", "us", "our"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our Platform.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            2. Description of Service
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Unirooms is an online platform that connects students seeking accommodation ("Users") with property owners/landlords ("Property Owners") who have PG accommodations available. We act solely as a mediator/facilitator to provide contact information.
                        </p>
                        <p className="text-neutral-600 mb-4">
                            <strong>Important:</strong> Unirooms does not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Own, manage, or operate any properties listed on the Platform</li>
                            <li>Act as a real estate agent, broker, or property manager</li>
                            <li>Guarantee the accuracy, quality, safety, or legality of any property listings</li>
                            <li>Participate in or mediate any transactions between Users and Property Owners</li>
                            <li>Provide any accommodation services directly</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            3. Service Fee
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>For Students:</strong> Browsing properties and accessing landlord contact information is completely FREE. No payment required.
                        </p>
                        <p className="text-neutral-600 mb-4">
                            <strong>For Landlords:</strong> A one-time platform listing fee of ₹99 (Rupees Ninety-Nine only) is charged to list a property on Unirooms. This fee is:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Non-refundable once the property is published on the platform</li>
                            <li>Separate from any rental payments or deposits from tenants</li>
                            <li>Only for listing the property - not a commission on rentals</li>
                            <li>A one-time payment per property listing</li>
                            <li>Covers platform maintenance, property verification, and connecting you with students</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            4. User Responsibilities
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            As a User of the Platform, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Provide accurate and complete information during registration</li>
                            <li>Conduct your own due diligence before entering into any agreement with Property Owners</li>
                            <li>Personally verify property details, conditions, and amenities before making any commitments</li>
                            <li>Read and understand all rental agreements before signing</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Not use the Platform for any unlawful or fraudulent purposes</li>
                            <li>Not harass, abuse, or harm other users or Property Owners</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>Unirooms shall not be liable for:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Any inaccuracies, errors, or misrepresentations in property listings</li>
                            <li>The quality, safety, legality, or availability of any properties</li>
                            <li>Any actions or omissions of Property Owners or other Users</li>
                            <li>Any disputes between Users and Property Owners</li>
                            <li>Any loss, damage, or injury resulting from property visits or rentals</li>
                            <li>Any financial losses incurred in transactions with Property Owners</li>
                            <li>Non-delivery of services or amenities promised by Property Owners</li>
                            <li>Any breach of rental agreements between Users and Property Owners</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            THE PLATFORM IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. YOUR USE OF THE PLATFORM IS AT YOUR SOLE RISK.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            6. Direct Relationship with Property Owners
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            All rental agreements, payments, deposits, and other transactions are directly between you and the Property Owner. Unirooms is not a party to these agreements and bears no responsibility for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Rental terms and conditions</li>
                            <li>Payment schedules and amounts</li>
                            <li>Security deposits and refunds</li>
                            <li>Property maintenance and repairs</li>
                            <li>Disputes or disagreements</li>
                            <li>Legal matters arising from the rental relationship</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            7. Property Owner Obligations
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Property Owners listing on the Platform agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Provide accurate and truthful information about their properties</li>
                            <li>Maintain their properties in a safe and habitable condition</li>
                            <li>Comply with all applicable housing and rental laws</li>
                            <li>Respond to User inquiries in a timely and professional manner</li>
                            <li>Honor the terms and conditions agreed upon with Users</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            8. Intellectual Property
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            All content on the Unirooms Platform, including text, graphics, logos, images, and software, is the property of Unirooms or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            9. Account Termination
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We reserve the right to suspend or terminate your account and access to the Platform at any time, without notice, for conduct that we believe:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Violates these Terms of Service</li>
                            <li>Is harmful to other users, Property Owners, or third parties</li>
                            <li>Violates applicable laws or regulations</li>
                            <li>Is fraudulent or abusive</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            10. Modifications to Terms
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms on the Platform. Your continued use of the Platform after such modifications constitutes your acceptance of the updated Terms.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            11. Governing Law
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="card p-8 bg-primary-50 border-primary-200"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            12. Contact Information
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="space-y-2 text-neutral-600">
                            <p><strong>Email:</strong> unirooms.in@gmail.com</p>
                            <p><strong>Phone:</strong> +91 8420514587</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
