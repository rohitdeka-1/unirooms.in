import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaFilter
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const AdminProperties = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    useEffect(() => {
        if (!user || user.email !== 'alkardorhd@gmail.com') {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);
    useEffect(() => {
        if (user?.email === 'alkardorhd@gmail.com') {
            fetchProperties();
        }
    }, [filter, user]);
    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/properties/admin/all?status=${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProperties(response.data.data.properties);
            
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };
    const handleApprove = async (propertyId) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(
                `${import.meta.env.VITE_API_URL}/properties/admin/${propertyId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));
            
            setSuccessMessage("Property approved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve property");
            setTimeout(() => setError(""), 3000);
        }
    };
    const handleDecline = (propertyId) => {
        setSelectedPropertyId(propertyId);
        setShowDeclineModal(true);
        setDeclineReason("");
    };

    const submitDecline = async () => {
        if (!declineReason.trim()) {
            setError("Please provide a reason for declining");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            setError("");
            const token = localStorage.getItem("accessToken");
            await axios.put(
                `${import.meta.env.VITE_API_URL}/properties/admin/${selectedPropertyId}/decline`,
                { reason: declineReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setProperties(prevProperties => prevProperties.filter(p => p._id !== selectedPropertyId));
            
            setSuccessMessage("Property declined! Email sent to landlord.");
            setTimeout(() => setSuccessMessage(""), 3000);
            
            setShowDeclineModal(false);
            setDeclineReason("");
            setSelectedPropertyId(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to decline property");
            setTimeout(() => setError(""), 3000);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 mt-10 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Admin Property Management
                    </h1>
                    <p className="text-gray-600">
                        Review and manage property listings
                    </p>
                </motion.div>
                {}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex gap-2 bg-white p-2 rounded-lg shadow-sm"
                >
                    <button
                        onClick={() => setFilter("pending")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${filter === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FaFilter className="text-sm" />
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter("verified")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${filter === "verified"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FaCheckCircle className="text-sm" />
                        Verified
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${filter === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All Properties
                    </button>
                </motion.div>
                {}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg"
                    >
                        {successMessage}
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}
                {}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {}
                {!loading && properties.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-500 text-lg">No properties found</p>
                    </motion.div>
                )}
                {!loading && properties.length > 0 && (
                    <div className="space-y-6">
                        {properties.map((property, index) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <FaMapMarkerAlt />
                                                    {property.city}, {property.state}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaRupeeSign />
                                                    {property.price.toLocaleString()}/month
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${property.isVerified
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {property.isVerified ? "Verified" : "Pending"}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-4">{property.description}</p>
                                    {}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            Landlord Information
                                        </h4>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p className="flex items-center gap-2">
                                                <FaUser className="text-gray-400" />
                                                <span className="font-medium">Name:</span>
                                                {property.landlordId?.name || "N/A"}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400" />
                                                <span className="font-medium">Email:</span>
                                                {property.landlordId?.email || "N/A"}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaPhone className="text-gray-400" />
                                                <span className="font-medium">Phone:</span>
                                                {property.phone || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    {}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Room Type</p>
                                            <p className="font-semibold text-gray-900 capitalize">
                                                {property.roomType}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Total Rooms</p>
                                            <p className="font-semibold text-gray-900">
                                                {property.totalRooms}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Available</p>
                                            <p className="font-semibold text-gray-900">
                                                {property.availableRooms}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600 mb-1">Near College</p>
                                            <p className="font-semibold text-gray-900">
                                                {property.campusName || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    {}
                                    {!property.isVerified && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(property._id)}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaCheckCircle />
                                                Approve Property
                                            </button>
                                            <button
                                                onClick={() => handleDecline(property._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaTimesCircle />
                                                Decline Property
                                            </button>
                                        </div>
                                    )}
                                    {property.isVerified && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                            <p className="text-green-700 font-medium">
                                                ✓ This property has been verified and is live
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Decline Reason Modal */}
                {showDeclineModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Decline Property
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for declining this property. An email will be sent to the landlord with your feedback.
                            </p>
                            <textarea
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="Enter reason for decline (e.g., incorrect information, missing documents, poor quality images...)" 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none text-gray-800 min-h-[120px] resize-none"
                                maxLength={500}
                            />
                            <div className="text-right text-sm text-gray-500 mt-1 mb-4">
                                {declineReason.length}/500
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeclineModal(false);
                                        setDeclineReason("");
                                        setSelectedPropertyId(null);
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitDecline}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTimesCircle />
                                    Decline & Send Email
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminProperties;
