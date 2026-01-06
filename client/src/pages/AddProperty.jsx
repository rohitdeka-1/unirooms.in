import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, paymentAPI } from '../utils/api';
import PaymentModal from '../components/PaymentModal';
import LocationPicker from '../components/LocationPickerMapbox';
import { getRandomDescription } from '../utils/pgDescriptions';

const AddProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [campuses, setCampuses] = useState([]);
    const [loadingCampuses, setLoadingCampuses] = useState(false);
    const [campusSearchQuery, setCampusSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        securityDeposit: '',
        location: {
            coordinates: ['', ''], // [longitude, latitude]
        },
        address: {
            street: '',
            locality: '',
            landmark: '',
            pincode: '',
        },
        city: '',
        state: '',
        phone: '',
        campusName: '', // Selected campus
        roomType: 'single',
        gender: 'any',
        totalRooms: '',
        availableRooms: '',
        amenities: [],
        images: [],
        imageFiles: [], // For storing the actual file objects
    });

    // Fetch available campuses on component mount
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                setLoadingCampuses(true);
                const response = await propertyAPI.getAllCampuses();
                if (response.success) {
                    setCampuses(response.data.campuses || []);
                }
            } catch (error) {
                console.error('Error fetching campuses:', error);
                setCampuses([]);
            } finally {
                setLoadingCampuses(false);
            }
        };

        fetchCampuses();
    }, []);

    // Filter campuses based on search query
    const filteredCampuses = campuses.filter(campus =>
        campus.name.toLowerCase().includes(campusSearchQuery.toLowerCase()) ||
        campus.city.toLowerCase().includes(campusSearchQuery.toLowerCase())
    );

    const amenitiesOptions = [
        { value: 'wifi', label: 'WiFi' },
        { value: 'ac', label: 'AC' },
        { value: 'parking', label: 'Parking' },
        { value: 'laundry', label: 'Laundry' },
        { value: 'meals', label: 'Meals' },
        { value: 'gym', label: 'Gym' },
        { value: 'water', label: 'Water 24/7' },
        { value: 'electricity', label: 'Electricity' },
        { value: 'security', label: 'Security' },
        { value: 'cctv', label: 'CCTV' },
        { value: 'powerBackup', label: 'Power Backup' },
        { value: 'attached_bathroom', label: 'Attached Bathroom' },
        { value: 'furnished', label: 'Furnished' },
        { value: 'semifurnished', label: 'Semi-Furnished' },
        { value: 'geyser', label: 'Geyser' },
        { value: 'fridge', label: 'Fridge' },
        { value: 'tv', label: 'TV' },
        { value: 'studyTable', label: 'Study Table' },
        { value: 'wardrobe', label: 'Wardrobe' },
        { value: 'balcony', label: 'Balcony' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child, index] = name.split('.');
            if (index !== undefined) {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: prev[parent][child].map((item, i) => i === Number(index) ? value : item)
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxImages = 5;
        
        // Check if adding these files would exceed the limit
        if (formData.imageFiles.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Create preview URLs
        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImagePreviews],
            imageFiles: [...prev.imageFiles, ...files],
        }));
    };

    const handleRemoveImage = (index) => {
        // Revoke the URL to free up memory
        URL.revokeObjectURL(formData.images[index]);
        
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imageFiles: prev.imageFiles.filter((_, i) => i !== index),
        }));
    };

    const handleAutoGenerateDescription = () => {
        const randomDesc = getRandomDescription();
        setFormData(prev => ({
            ...prev,
            description: randomDesc
        }));
    };

    const handlePaymentSuccess = async (pId) => {
        setPaymentId(pId);
        setShowPaymentModal(false);

        // Now submit the property
        await handleSubmitProperty(pId);
    };

    const handleSubmitProperty = async (pId) => {
        try {
            setLoading(true);

            // Create FormData for file upload
            const formDataToSend = new FormData();
            
            // Append images
            formData.imageFiles.forEach((file) => {
                formDataToSend.append('images', file);
            });

            // Append other property data as JSON string
            const propertyData = {
                ...formData,
                price: Number(formData.price),
                securityDeposit: Number(formData.securityDeposit || 0),
                totalRooms: Number(formData.totalRooms),
                availableRooms: Number(formData.availableRooms),
                location: {
                    type: 'Point',
                    coordinates: [
                        Number(formData.location.coordinates[0]),
                        Number(formData.location.coordinates[1])
                    ]
                },
                paymentId: pId,
            };
            
            // Remove images and imageFiles from data to send as JSON
            delete propertyData.images;
            delete propertyData.imageFiles;
            
            // Append each field individually
            Object.keys(propertyData).forEach(key => {
                if (key === 'location' || key === 'address') {
                    formDataToSend.append(key, JSON.stringify(propertyData[key]));
                } else if (key === 'amenities') {
                    propertyData[key].forEach(amenity => {
                        formDataToSend.append('amenities[]', amenity);
                    });
                } else {
                    formDataToSend.append(key, propertyData[key]);
                }
            });

            await propertyAPI.createProperty(formDataToSend);
            alert('Property created successfully!');
            navigate('/landlord/dashboard');
        } catch (error) {
            console.error('Error creating property:', error);
            alert(error.message || 'Failed to create property');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title || !formData.description || !formData.price) {
            alert('Please fill all required fields');
            return;
        }

        // Show payment modal
        setShowPaymentModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-semibold mb-4">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        List Your Property
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-neutral-800 via-neutral-700 to-primary-600 bg-clip-text text-transparent mb-3">
                        Add New Property
                    </h1>
                    <p className="text-neutral-600 text-lg">Fill in the details to list your property for just ₹99</p>

                    {/* Progress Steps */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">1</div>
                            <span className="text-sm font-medium text-neutral-700">Details</span>
                        </div>
                        <div className="w-12 h-0.5 bg-neutral-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-semibold">2</div>
                            <span className="text-sm font-medium text-neutral-500">Payment</span>
                        </div>
                        <div className="w-12 h-0.5 bg-neutral-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-semibold">3</div>
                            <span className="text-sm font-medium text-neutral-500">Live</span>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Location Picker - FIRST & MOST PROMINENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl shadow-green-200/50 p-8 border-2 border-green-200"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-green-200">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-300 animate-pulse">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-green-900">📍 Step 1: Set Your Property Location</h2>
                                <p className="text-sm text-green-700 font-medium">Start here! This auto-fills address details below</p>
                            </div>
                        </div>

                        <div>
                            <LocationPicker
                                onLocationSelect={(locationData) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        location: {
                                            coordinates: locationData.coordinates
                                        },
                                        address: {
                                            ...prev.address,
                                            street: locationData.addressComponents?.street || prev.address.street,
                                            locality: locationData.addressComponents?.locality || prev.address.locality,
                                            pincode: locationData.addressComponents?.pincode || prev.address.pincode,
                                        },
                                        city: locationData.addressComponents?.city || prev.city,
                                        state: locationData.addressComponents?.state || prev.state,
                                    }));
                                }}
                                initialLocation={
                                    formData.location.coordinates[0] && formData.location.coordinates[1]
                                        ? { lng: Number(formData.location.coordinates[0]), lat: Number(formData.location.coordinates[1]) }
                                        : null
                                }
                            />
                        </div>
                    </motion.div>

                    {/* Basic Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 p-8 border border-neutral-100 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-800">Basic Information</h2>
                                <p className="text-sm text-neutral-500">Tell us about your property</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    minLength={10}
                                    maxLength={100}
                                    className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                    placeholder="e.g., Comfortable PG near VIT Bhopal Campus"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <label className="block text-sm font-semibold text-neutral-700">Description *</label>
                                    <button
                                        type="button"
                                        onClick={handleAutoGenerateDescription}
                                        className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Auto Generate
                                    </button>
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    minLength={20}
                                    maxLength={1000}
                                    rows={5}
                                    className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400 resize-none"
                                    placeholder="Describe your property, facilities, nearby landmarks, and what makes it special..."
                                />
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-neutral-500 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Minimum 20 characters • Click "Auto Generate" for a ready-made description
                                    </span>
                                    <span className={`font-semibold ${formData.description.length >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {formData.description.length}/1000
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Monthly Rent (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min={500}
                                            max={100000}
                                            className="w-full pl-8 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Security Deposit (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
                                        <input
                                            type="number"
                                            name="securityDeposit"
                                            value={formData.securityDeposit}
                                            onChange={handleChange}
                                            min={0}
                                            className="w-full pl-8 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Room Type *</label>
                                    <select
                                        name="roomType"
                                        value={formData.roomType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 cursor-pointer"
                                    >
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="triple">Triple</option>
                                        <option value="shared">Shared</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 cursor-pointer"
                                    >
                                        <option value="any">Any</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Total Rooms *</label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleChange}
                                        required
                                        min={1}
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Available Rooms *</label>
                                <input
                                    type="number"
                                    name="availableRooms"
                                    value={formData.availableRooms}
                                    onChange={handleChange}
                                    required
                                    min={0}
                                    className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800"
                                    placeholder="5"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Address & Location */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 p-8 border border-neutral-100 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-800">Address & Location</h2>
                                <p className="text-sm text-neutral-500">Where is your property located?</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Street Address *</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Locality *</label>
                                    <input
                                        type="text"
                                        name="address.locality"
                                        value={formData.address.locality}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                        placeholder="Koramangala"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Landmark</label>
                                    <input
                                        type="text"
                                        name="address.landmark"
                                        value={formData.address.landmark}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                        placeholder="Near City Mall"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                        placeholder="Bangalore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                        placeholder="Karnataka"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">Pincode *</label>
                                    <input
                                        type="text"
                                        name="address.pincode"
                                        value={formData.address.pincode}
                                        onChange={handleChange}
                                        required
                                        pattern="\d{6}"
                                        className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                        placeholder="560001"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-neutral-700 mb-2.5">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Contact Phone Number *
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-neutral-600 font-semibold">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // Only numbers
                                            if (value.length <= 10) {
                                                handleChange({ target: { name: 'phone', value } });
                                            }
                                        }}
                                        required
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        className="w-full pl-16 pr-12 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400 font-mono tracking-wider"
                                        placeholder="9876543210"
                                    />
                                    {formData.phone.length === 10 && (
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <div className="bg-green-100 rounded-full p-1">
                                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
                                    <span className={formData.phone.length === 10 ? 'text-green-600 font-semibold' : 'font-medium'}>
                                        {formData.phone.length}/10 digits
                                    </span>
                                    {formData.phone.length > 0 && formData.phone.length < 10 && (
                                        <span className="text-amber-600 font-medium">• {10 - formData.phone.length} more needed</span>
                                    )}
                                </p>
                            </div>

                            {/* Campus Selection - Moved Here */}
                            <div className="mt-8">
                                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2.5">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    Select Campus *
                                </label>
                                <p className="text-xs text-neutral-500 mb-4">Choose the campus your property is associated with. Students will find your property when searching for this campus.</p>

                                {loadingCampuses ? (
                                    <div className="p-6 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl text-center">
                                        <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-primary-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-sm font-medium text-neutral-600">Loading campuses...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Search Input */}
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={campusSearchQuery}
                                                onChange={(e) => setCampusSearchQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                                placeholder="Search campus by name or city..."
                                            />
                                        </div>

                                        {/* Campus Dropdown */}
                                        <div className="relative">
                                            <select
                                                name="campusName"
                                                value={formData.campusName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all outline-none text-neutral-800 appearance-none cursor-pointer"
                                            >
                                                <option value="">-- Select a Campus --</option>
                                                {filteredCampuses.map((campus, index) => (
                                                    <option key={index} value={campus.name}>
                                                        {campus.name} - {campus.city}, {campus.state}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Selected Campus Display */}
                                        {formData.campusName && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-800 text-base">{formData.campusName}</p>
                                                        <p className="text-xs text-neutral-600 mt-0.5">Students searching for "{formData.campusName}" will see this property</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Property Images */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 p-8 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-800">Property Images</h2>
                                <p className="text-sm text-neutral-500">Upload up to 5 images (Max 5MB each)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Upload Button */}
                            {formData.imageFiles.length < 5 && (
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer">
                                        <svg className="w-12 h-12 mx-auto text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm font-semibold text-neutral-700 mb-1">Click to upload images</p>
                                        <p className="text-xs text-neutral-500">JPEG, JPG, PNG or WEBP (Max 5MB each)</p>
                                    </div>
                                </label>
                            )}

                            {/* Image Previews */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-xl border-2 border-neutral-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                                {index + 1}/5
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.imageFiles.length === 0 && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-sm text-amber-800 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Images help attract more tenants. Add at least one image to showcase your property!
                                    </p>
                                </div>
                            )}

                            {formData.imageFiles.length > 0 && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="text-sm font-medium text-green-800">
                                        ✓ {formData.imageFiles.length} image{formData.imageFiles.length > 1 ? 's' : ''} uploaded
                                        {formData.imageFiles.length < 5 && ` (You can add ${5 - formData.imageFiles.length} more)`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Amenities */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 p-8 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-800">Amenities & Features</h2>
                                <p className="text-sm text-neutral-500">Select all amenities available at your property</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {amenitiesOptions.map((amenity, index) => (
                                <motion.label
                                    key={amenity.value}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.amenities.includes(amenity.value) ? 'bg-primary-50 border-primary-500 shadow-sm shadow-primary-200' : 'bg-neutral-50 border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.value)}
                                        onChange={() => handleAmenityToggle(amenity.value)}
                                        className="w-5 h-5 text-primary-600 rounded-lg focus:ring-4 focus:ring-primary-100 transition-all"
                                    />
                                    <span className={`text-sm font-medium ${formData.amenities.includes(amenity.value) ? 'text-primary-900' : 'text-neutral-700'}`}>
                                        {amenity.label}
                                    </span>
                                    {formData.amenities.includes(amenity.value) && (
                                        <svg className="w-5 h-5 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </motion.label>
                            ))}
                        </div>

                        {formData.amenities.length > 0 && (
                            <div className="mt-5 p-4 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl">
                                <p className="text-sm font-medium text-primary-900">
                                    <span className="font-bold text-lg">{formData.amenities.length}</span> amenities selected
                                </p>
                            </div>
                        )}
                    </motion.div>


                    {/* Submit Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 pt-8"
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/landlord/dashboard')}
                            className="flex-1 px-8 py-4 bg-white border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-sm hover:shadow-md"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Cancel
                            </span>
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Property...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Pay ₹99 & List Property
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    </motion.div>
                </motion.form>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default AddProperty;
