import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const ListPropertyRedirect = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated && user?.role === 'landlord') {
            navigate('/landlord/add-property', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);
    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-24 md:pb-12 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-8 md:p-12 text-center"
                >
                    {}
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                        List Your Property on Unirooms
                    </h1>
                    <p className="text-neutral-600 mb-8">
                        To list your property on Unirooms, you need to create a landlord account first. Join hundreds of property owners reaching thousands of students looking for accommodation.
                    </p>
                    {}
                    <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                        <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
                            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-1">Free Listing</h3>
                                <p className="text-sm text-neutral-600">List your property for free and reach thousands of students</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
                            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-1">Direct Contact</h3>
                                <p className="text-sm text-neutral-600">Students contact you directly - no middleman</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
                            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-1">Easy Management</h3>
                                <p className="text-sm text-neutral-600">Manage all your listings from one dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
                            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-neutral-800 mb-1">Verified Platform</h3>
                                <p className="text-sm text-neutral-600">Trusted by students across India</p>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-neutral-700 mb-4">
                            Choose an option to continue:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/signup', { state: { role: 'landlord', redirectTo: '/landlord/add-property' } })}
                                className="btn-primary px-8 py-3 text-center"
                            >
                                Create Landlord Account
                            </button>
                            <button
                                onClick={() => navigate('/login', { state: { redirectTo: '/landlord/add-property' } })}
                                className="btn-secondary px-8 py-3 text-center"
                            >
                                Already Have Account? Login
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-4">
                            By creating an account, you agree to our{' '}
                            <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </motion.div>
                {}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-neutral-600 hover:text-neutral-800 text-sm inline-flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ListPropertyRedirect;
