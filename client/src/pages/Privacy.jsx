import { motion } from 'framer-motion';

const Privacy = () => {
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
                        Privacy Policy
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
                            1. Introduction
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            At Unirooms ("we", "us", "our"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
                        </p>
                        <p className="text-neutral-600">
                            Please read this Privacy Policy carefully. By using the Platform, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            2. Information We Collect
                        </h2>
                        <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-4">
                            2.1 Personal Information
                        </h3>
                        <p className="text-neutral-600 mb-4">
                            We may collect personal information that you voluntarily provide to us when you:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4 mb-4">
                            <li>Register for an account</li>
                            <li>Make a payment for our services</li>
                            <li>Contact us for support or inquiries</li>
                            <li>Subscribe to our newsletters or updates</li>
                        </ul>
                        <p className="text-neutral-600 mb-4">
                            This information may include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Payment information</li>
                            <li>University/College information</li>
                            <li>Accommodation preferences</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-neutral-800 mb-3 mt-6">
                            2.2 Automatically Collected Information
                        </h3>
                        <p className="text-neutral-600 mb-4">
                            When you access our Platform, we may automatically collect:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>IP address</li>
                            <li>Browser type and version</li>
                            <li>Device information</li>
                            <li>Pages visited and time spent</li>
                            <li>Referring website</li>
                            <li>Operating system</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We use the collected information for various purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>To provide and maintain our Platform</li>
                            <li>To process your payments and transactions</li>
                            <li>To provide you with property owner contact information</li>
                            <li>To send you service-related notifications</li>
                            <li>To respond to your inquiries and provide customer support</li>
                            <li>To improve and personalize your experience</li>
                            <li>To analyze usage and improve our services</li>
                            <li>To detect and prevent fraud or abuse</li>
                            <li>To comply with legal obligations</li>
                            <li>To send promotional communications (with your consent)</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            4. Sharing Your Information
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li><strong>With Property Owners:</strong> Your contact information may be shared with property owners when you express interest in their properties</li>
                            <li><strong>Service Providers:</strong> We may share data with third-party service providers who assist in operating our Platform (e.g., payment processors, hosting services)</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                            <li><strong>With Your Consent:</strong> We may share information for any other purpose with your explicit consent</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            <strong>We do not sell your personal information to third parties.</strong>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            5. Data Security
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                            <li>Encrypted storage of sensitive information</li>
                            <li>Regular security assessments and updates</li>
                            <li>Restricted access to personal information</li>
                            <li>Secure payment processing through trusted third-party providers</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            6. Cookies and Tracking Technologies
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We use cookies and similar tracking technologies to track activity on our Platform and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.
                        </p>
                        <p className="text-neutral-600 mb-4">
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            7. Your Privacy Rights
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600 ml-4">
                            <li><strong>Access:</strong> Request access to your personal information</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                            <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                            <li><strong>Objection:</strong> Object to processing of your personal information</li>
                        </ul>
                        <p className="text-neutral-600 mt-4">
                            To exercise these rights, please contact us at unirooms.in@gmail.com
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            8. Data Retention
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            9. Third-Party Links
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Our Platform may contain links to third-party websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            10. Children's Privacy
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Our Platform is not intended for use by children under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to delete such information.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            11. Changes to This Privacy Policy
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="card p-8 bg-primary-50 border-primary-200"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
                            12. Contact Us
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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

export default Privacy;
