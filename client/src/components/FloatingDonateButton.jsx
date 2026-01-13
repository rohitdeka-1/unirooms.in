import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DonationModal from './DonationModal';

const FloatingDonateButton = () => {
    const [showDonation, setShowDonation] = useState(false);

    return (
        <>
             <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                onClick={() => setShowDonation(true)}
                className="fixed right-4 bottom-20 md:bottom-6 z-40 w-14 h-14 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-500/40 flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <img src="/rmthunda.gif" alt="Support" className="w-80 h-20" />
            </motion.button>

             <AnimatePresence>
                {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
            </AnimatePresence>
        </>
    );
};

export default FloatingDonateButton;
