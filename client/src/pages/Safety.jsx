import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { updateMetaTags, pageSEO } from '../utils/seo';
const Safety = () => {
    useEffect(() => {
        updateMetaTags(pageSEO.safety);
    }, []);
    const safetyTips = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: 'Always Visit in Person',
            description: 'Never finalize any accommodation without visiting the property in person. Check the actual condition, location, and facilities before making any commitment.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Verify Property Owner Identity',
            description: 'Always verify the identity of the property owner. Ask for valid ID proof and property documents. Cross-check the contact details provided on our platform.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Read Rental Agreement Carefully',
            description: 'Carefully read and understand all terms and conditions in the rental agreement. Don\'t sign any document without thoroughly reviewing it. Seek legal advice if needed.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Secure Payment Methods',
            description: 'Make payments only through secure methods. Get proper receipts for all payments. Avoid making cash payments without documentation. Never share your payment details over unsecured channels.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Take Someone Along',
            description: 'When visiting a property for the first time, take a friend or family member with you. Inform someone about your whereabouts. Visit during daytime hours whenever possible.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Document Everything',
            description: 'Take photos and videos of the property condition before moving in. Keep copies of all documents, agreements, and payment receipts. This documentation can be crucial in case of disputes.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            title: 'Check Safety Features',
            description: 'Verify that the property has proper safety features like fire extinguishers, secure locks, emergency exits, and adequate lighting. Check for CCTV cameras if advertised.'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Trust Your Instincts',
            description: 'If something feels wrong or too good to be true, trust your instincts. Don\'t let anyone pressure you into making quick decisions. Take your time to evaluate all options.'
        }
    ];
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-24 md:pb-12">
            <div className="container mx-auto px-4">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
                        Safety Guidelines
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Your safety is our priority. Follow these guidelines to ensure a secure accommodation search experience.
                    </p>
                </motion.div>
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-12"
                >
                    <div className="card p-8 bg-amber-50 border-amber-200">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-800 mb-2">Important Notice</h3>
                                <p className="text-neutral-700 mb-2">
                                    <strong>Unirooms is a connecting platform only.</strong> We provide contact information to help you connect with property owners. All negotiations, agreements, and transactions happen directly between you and the landlord.
                                </p>
                                <p className="text-neutral-700">
                                    We are not responsible for the property condition, amenities, or any disputes that may arise. Please exercise due diligence and follow all safety guidelines when engaging with property owners.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {}
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-display font-bold text-neutral-800 mb-8 text-center"
                    >
                        Essential Safety Tips
                    </motion.h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {safetyTips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="card p-6"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-600">
                                        {tip.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800 mb-2">
                                            {tip.title}
                                        </h3>
                                        <p className="text-neutral-600 text-sm">
                                            {tip.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto mt-12"
                >
                    <div className="card p-8 bg-red-50 border-red-200">
                        <h3 className="text-xl font-bold text-neutral-800 mb-4">Report Suspicious Activity</h3>
                        <p className="text-neutral-700 mb-4">
                            If you encounter any suspicious activity, fraudulent listings, or safety concerns, please report it to us immediately.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="mailto:unirooms.in@gmail.com" className="btn-primary inline-block text-center">
                                Report via Email
                            </a>
                            <a href="tel:+918420514587" className="btn-secondary inline-block text-center">
                                Call Us: +91 8420514587
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default Safety;
