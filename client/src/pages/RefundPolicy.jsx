import { motion } from 'framer-motion';
const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-24 md:pb-12 mt-7">
            <div className="container mx-auto px-4">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
                        Refund Policy
                    </h1>
                    <p className="text-lg text-neutral-600">
                        Last updated: January 5, 2026
                    </p>
                </motion.div>
                {}
                <div className="max-w-4xl mx-auto space-y-8">
                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-8 bg-amber-50 border-amber-200"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-800 mb-2">Important Notice</h3>
                                <p className="text-neutral-700">
                                    Please read this Refund Policy carefully before making any payment on the Unirooms Platform. By proceeding with payment, you acknowledge that you have read, understood, and agree to this policy.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            1. Overview
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>For Students:</strong> Unirooms is 100% FREE for students. You can browse all properties, view complete details, and access landlord contact information without any payment.
                        </p>
                        <p className="text-neutral-600 mb-4">
                            <strong>For Landlords:</strong> Unirooms charges a one-time platform listing fee of <strong>₹99 (Rupees Ninety-Nine only)</strong> to list your property on our platform. This fee helps us maintain the platform, verify properties, and connect you with genuine students looking for accommodation. This fee is separate from any rental payments, deposits, or other fees you receive from tenants.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            2. Nature of Our Service
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>Unirooms is a mediator platform only.</strong> We:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mb-4">
                            <li>Connect students with property owners</li>
                            <li>Provide a platform for landlords to list their properties</li>
                            <li>Enable students to browse and contact landlords for FREE</li>
                            <li>Facilitate initial communication between parties</li>
                        </ul>
                        <p className="text-neutral-600 mb-4">
                            <strong>We do NOT:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Own, manage, or operate any properties</li>
                            <li>Act as real estate agents or brokers</li>
                            <li>Participate in rental agreements or transactions</li>
                            <li>Handle rental payments, deposits, or refunds between tenants and landlords</li>
                            <li>Guarantee property availability, quality, or conditions</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-8 bg-red-50 border-red-200"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            3. No Refund Policy for Platform Listing Fee
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>The ₹99 platform listing fee is non-refundable once your property has been published on Unirooms.</strong>
                        </p>
                        <p className="text-neutral-600 mb-4">
                            This is because:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>The service (publishing your property on the platform) has been delivered immediately upon payment</li>
                            <li>Your property becomes visible to thousands of students once published</li>
                            <li>Platform resources are allocated for hosting and displaying your listing</li>
                            <li>Our service is complete once the property is live on the platform</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            4. What the ₹99 Fee Covers
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            The one-time listing fee of ₹99 covers:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Publishing your property on Unirooms platform</li>
                            <li>Displaying your property photos, details, and contact information</li>
                            <li>Platform maintenance and server operations</li>
                            <li>Property verification and quality checks</li>
                            <li>Customer support for platform-related queries</li>
                            <li>Reaching thousands of students looking for accommodation</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            <strong>This fee does NOT cover or guarantee:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mt-2">
                            <li>Finding tenants for your property</li>
                            <li>Number of inquiries or student interest</li>
                            <li>Successful rental agreements</li>
                            <li>Property occupancy rates</li>
                            <li>Acting as your property manager or agent</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            5. Tenant-Landlord Refund Policies
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            <strong>Unirooms is NOT responsible for any refund policies related to:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mb-4">
                            <li>Rental payments to landlords</li>
                            <li>Security deposits</li>
                            <li>Advance payments</li>
                            <li>Maintenance charges</li>
                            <li>Any other fees charged by property owners</li>
                        </ul>
                        <p className="text-neutral-600 mb-4">
                            All financial transactions between students and property owners are direct and independent of Unirooms. Any refund requests related to rental payments or deposits must be directed to the property owner as per your rental agreement with them.
                        </p>
                        <p className="text-neutral-600">
                            <strong>We strongly recommend:</strong> Students should discuss and clearly understand the landlord's refund policy before making any payments to them.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            6. Exceptions to No Refund Policy
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Refunds of the ₹99 listing fee may be considered ONLY in the following exceptional circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li><strong>Technical Error:</strong> If a payment was processed multiple times due to a technical error on our platform</li>
                            <li><strong>Contact Information Not Provided:</strong> If we fail to provide the promised contact information after payment</li>
                            <li><strong>Incorrect Contact Information:</strong> If the contact information provided is completely incorrect or non-functional (subject to verification)</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            <strong>Refunds will NOT be provided for:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mt-2">
                            <li>Landlord not responding to your calls/messages</li>
                            <li>Property already rented out</li>
                            <li>Changed your mind after receiving contact information</li>
                            <li>Property not meeting your expectations</li>
                            <li>Unable to reach an agreement with the landlord</li>
                            <li>Found alternative accommodation</li>
                            <li>Any issues arising from your interaction with the landlord</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            7. How to Request a Refund
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            If you believe you qualify for a refund under the exceptions listed above, please contact us within <strong>24 hours of payment</strong> with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mb-4">
                            <li>Your transaction ID</li>
                            <li>Registered email address</li>
                            <li>Detailed explanation of the issue</li>
                            <li>Supporting evidence (screenshots, etc.)</li>
                        </ul>
                        <div className="space-y-2 text-neutral-600">
                            <p><strong>Email:</strong> unirooms.in@gmail.com</p>
                            <p><strong>Phone:</strong> +91 8420514587</p>
                        </div>
                        <p className="text-neutral-600 mt-4">
                            We will review your request within 3-5 business days. If approved, refunds will be processed to the original payment method within 7-10 business days.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            8. Payment Security
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            All payments are processed through secure third-party payment gateways. We do not store your complete payment card details. For payment-related issues (failed transactions, payment errors, etc.), please contact our support team immediately.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            9. Dispute Resolution
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            If you have any disputes regarding refunds or payments, please contact us first. We are committed to resolving all issues fairly and promptly. For any unresolved disputes, the jurisdiction shall be as per the Terms of Service.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            10. Changes to This Policy
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We reserve the right to modify this Refund Policy at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the Platform after such changes constitutes acceptance of the updated policy.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="card p-8 bg-primary-50 border-primary-200"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            Contact Us
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            For any questions or concerns regarding this Refund Policy, please contact us:
                        </p>
                        <div className="space-y-2 text-neutral-600">
                            <p><strong>Email:</strong> unirooms.in@gmail.com</p>
                            <p><strong>Phone:</strong> +91 8420514587</p>
                            <p><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM IST</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
export default RefundPolicy;
