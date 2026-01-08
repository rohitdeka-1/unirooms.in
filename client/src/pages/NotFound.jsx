import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                <div className="mb-8">
                    <h1 className="text-9xl font-display font-bold text-primary-600 mb-4">404</h1>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Link>
                    <Link
                        to="/browse"
                        className="inline-flex items-center justify-center px-8 py-4 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-900 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Properties
                    </Link>
                </div>
                <div className="mt-12">
                    <img 
                        src="https://illustrations.popsy.co/amber/error-404.svg" 
                        alt="404 illustration" 
                        className="w-full max-w-md mx-auto opacity-50"
                    />
                </div>
            </motion.div>
        </div>
    );
};
export default NotFound;
