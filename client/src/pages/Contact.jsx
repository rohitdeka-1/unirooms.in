import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { updateMetaTags, pageSEO } from '../utils/seo';

const Contact = () => {
    useEffect(() => {
        updateMetaTags(pageSEO.contact);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
                        Contact Us
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Have questions? We're here to help. Reach out to us through any of the channels below.
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="card p-8">
                            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                                Get in Touch
                            </h2>
                            
                            {/* Email */}
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-800 mb-1">Email</h3>
                                    <a href="mailto:unirooms.in@gmail.com" className="text-primary-600 hover:text-primary-700">
                                        unirooms.in@gmail.com
                                    </a>
                                    <p className="text-sm text-neutral-500 mt-1">We'll respond within 24 hours</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-800 mb-1">Phone</h3>
                                    <a href="tel:+918420514587" className="text-primary-600 hover:text-primary-700">
                                        +91 8420514587
                                    </a>
                                    <p className="text-sm text-neutral-500 mt-1">Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-800 mb-1">Location</h3>
                                    <p className="text-neutral-600">
                                        India
                                    </p>
                                    <p className="text-sm text-neutral-500 mt-1">Serving students across India</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Quick Links */}
                        <div className="card p-8">
                            <h3 className="font-semibold text-neutral-800 mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <a href="/safety" className="block text-primary-600 hover:text-primary-700 text-sm">
                                    → Safety Guidelines
                                </a>
                                <a href="/pricing" className="block text-primary-600 hover:text-primary-700 text-sm">
                                    → Pricing Information
                                </a>
                                <a href="/terms" className="block text-primary-600 hover:text-primary-700 text-sm">
                                    → Terms of Service
                                </a>
                                <a href="/refund-policy" className="block text-primary-600 hover:text-primary-700 text-sm">
                                    → Refund Policy
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                            Send us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="input"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full">
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
