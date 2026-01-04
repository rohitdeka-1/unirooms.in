import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, paymentAPI } from '../utils/api';
import PaymentModal from '../components/PaymentModal';
import LocationPicker from '../components/LocationPicker';

const AddProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nearbyColleges, setNearbyColleges] = useState([]);
    const [loadingColleges, setLoadingColleges] = useState(false);
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
        roomType: 'single',
        gender: 'any',
        totalRooms: '',
        availableRooms: '',
        amenities: [],
        images: [],
    });

    // Fetch nearby colleges when location changes
    useEffect(() => {
        const fetchNearbyColleges = async () => {
            const [lon, lat] = formData.location.coordinates;
            
            if (lat && lon && lat !== '' && lon !== '') {
                try {
                    setLoadingColleges(true);
                    const response = await propertyAPI.getNearbyColleges(lat, lon, 10);
                    if (response.success) {
                        setNearbyColleges(response.data.nearbyColleges || []);
                    }
                } catch (error) {
                    console.error('Error fetching nearby colleges:', error);
                    setNearbyColleges([]);
                } finally {
                    setLoadingColleges(false);
                }
            } else {
                setNearbyColleges([]);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(fetchNearbyColleges, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.location.coordinates]);

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

    const handlePaymentSuccess = async (pId) => {
        setPaymentId(pId);
        setShowPaymentModal(false);
        
        // Now submit the property
        await handleSubmitProperty(pId);
    };

    const handleSubmitProperty = async (pId) => {
        try {
            setLoading(true);

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

            await propertyAPI.createProperty(propertyData);
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
        <div className="min-h-screen bg-neutral-50 pt-28 pb-24 md:pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                        Add New Property
                    </h1>
                    <p className="text-neutral-600 mt-1">Fill in the details to list your property (₹100 per listing)</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="card p-6 md:p-8 space-y-6"
                >
                    {/* Basic Details */}
                    <div>
                        <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">Basic Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    minLength={10}
                                    maxLength={100}
                                    className="input"
                                    placeholder="e.g., Comfortable PG near XYZ College"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    minLength={20}
                                    maxLength={1000}
                                    rows={4}
                                    className="input"
                                    placeholder="Describe your property, facilities, and nearby landmarks..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Monthly Rent (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min={500}
                                        max={100000}
                                        className="input"
                                        placeholder="5000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Security Deposit (₹)</label>
                                    <input
                                        type="number"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                        min={0}
                                        className="input"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Room Type *</label>
                                    <select name="roomType" value={formData.roomType} onChange={handleChange} required className="input">
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="triple">Triple</option>
                                        <option value="shared">Shared</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Gender *</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required className="input">
                                        <option value="any">Any</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Total Rooms *</label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleChange}
                                        required
                                        min={1}
                                        className="input"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Available Rooms *</label>
                                <input
                                    type="number"
                                    name="availableRooms"
                                    value={formData.availableRooms}
                                    onChange={handleChange}
                                    required
                                    min={0}
                                    className="input"
                                    placeholder="5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">Address</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Locality *</label>
                                    <input
                                        type="text"
                                        name="address.locality"
                                        value={formData.address.locality}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="Koramangala"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Landmark</label>
                                    <input
                                        type="text"
                                        name="address.landmark"
                                        value={formData.address.landmark}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Near City Mall"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="Bangalore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="Karnataka"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="address.pincode"
                                        value={formData.address.pincode}
                                        onChange={handleChange}
                                        required
                                        pattern="\d{6}"
                                        className="input"
                                        placeholder="560001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-3">Property Location *</label>
                                <LocationPicker
                                    onLocationSelect={(locationData) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            location: {
                                                coordinates: locationData.coordinates
                                            },
                                            // Auto-fill address fields if available
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

                            {/* Nearby Colleges Display */}
                            {formData.location.coordinates[0] && formData.location.coordinates[1] && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Nearby Colleges (within 10km)
                                    </h3>
                                    
                                    {loadingColleges ? (
                                        <div className="p-4 bg-neutral-50 rounded-lg text-center text-sm text-neutral-500">
                                            <svg className="animate-spin h-5 w-5 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Finding nearby colleges...
                                        </div>
                                    ) : nearbyColleges.length > 0 ? (
                                        <div className="space-y-2">
                                            {nearbyColleges.map((college, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-800">{college.name}</p>
                                                            <p className="text-xs text-neutral-500">Students searching for "{college.name}" will see this property</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                            {college.distance} km
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-amber-800">No colleges found nearby</p>
                                                    <p className="text-xs text-amber-600 mt-1">Your property is more than 10km away from registered colleges. Students won't see it in college-based searches, but it will still appear in location searches.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {amenitiesOptions.map((amenity) => (
                                <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.value)}
                                        onChange={() => handleAmenityToggle(amenity.value)}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700">{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6 border-t border-neutral-200">
                        <button
                            type="button"
                            onClick={() => navigate('/landlord/dashboard')}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Creating...' : 'Pay ₹100 & List Property'}
                        </button>
                    </div>
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
