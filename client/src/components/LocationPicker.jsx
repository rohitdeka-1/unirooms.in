import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(
        initialLocation || { lat: 28.6139, lng: 77.2090 } // Default: New Delhi
    );
    const [address, setAddress] = useState('');
    const [mapType, setMapType] = useState('roadmap'); // 'roadmap' or 'satellite'
    const [isLocating, setIsLocating] = useState(false);
    const [mapCenter, setMapCenter] = useState(selectedLocation);
    const [zoom, setZoom] = useState(15);
    
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Geocode coordinates to get address
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await geocoder.geocode({
                location: { lat, lng }
            });

            if (result.results[0]) {
                const addr = result.results[0].formatted_address;
                setAddress(addr);
                return addr;
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return '';
    }, []);

    // Handle map click
    const handleMapClick = useCallback(async (e) => {
        const newLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setSelectedLocation(newLocation);
        setMapCenter(newLocation);
        
        const addr = await reverseGeocode(newLocation.lat, newLocation.lng);
        
        if (onLocationSelect) {
            onLocationSelect({
                coordinates: [newLocation.lng, newLocation.lat],
                address: addr
            });
        }
    }, [onLocationSelect, reverseGeocode]);

    // Auto-detect current location
    const handleAutoDetect = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setSelectedLocation(newLocation);
                setMapCenter(newLocation);
                setZoom(18);
                
                const addr = await reverseGeocode(newLocation.lat, newLocation.lng);
                
                if (onLocationSelect) {
                    onLocationSelect({
                        coordinates: [newLocation.lng, newLocation.lat],
                        address: addr
                    });
                }
                setIsLocating(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please enable location services.');
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Handle place selection from autocomplete
    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setSelectedLocation(newLocation);
                setMapCenter(newLocation);
                setZoom(18);
                const addr = place.formatted_address || '';
                setAddress(addr);
                
                if (onLocationSelect) {
                    onLocationSelect({
                        coordinates: [newLocation.lng, newLocation.lat],
                        address: addr
                    });
                }
            }
        }
    };

    const onAutocompleteLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
        
        // Restrict search to India
        autocomplete.setComponentRestrictions({ country: 'in' });
    };

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
        borderRadius: '1rem'
    };

    const mapOptions = {
        mapTypeId: mapType,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy'
    };

    return (
        <div className="space-y-4">
            {/* Auto-Detect Button - Most Prominent */}
            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={handleAutoDetect}
                    disabled={isLocating}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLocating ? (
                        <>
                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Detecting...
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            📍 Auto-Detect My Location
                        </>
                    )}
                </button>
            </div>

            {/* Search Bar and Map Type Toggle */}
            <div className="space-y-3">
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Google Places Autocomplete */}
                        <div className="flex-1">
                            <Autocomplete
                                onLoad={onAutocompleteLoad}
                                onPlaceChanged={onPlaceChanged}
                            >
                                <input
                                    type="text"
                                    placeholder="🔍 Search colleges, landmarks, or addresses in India..."
                                    className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-neutral-800 placeholder:text-neutral-400"
                                />
                            </Autocomplete>
                        </div>

                        {/* Map Type Toggle */}
                        <div className="flex bg-neutral-100 rounded-xl p-1.5 gap-1">
                            <button
                                type="button"
                                onClick={() => setMapType('roadmap')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    mapType === 'roadmap'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            >
                                🗺️ Street
                            </button>
                            <button
                                type="button"
                                onClick={() => setMapType('satellite')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    mapType === 'satellite'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            >
                                🛰️ Satellite
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-neutral-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Search for your property location or click on the map to select
                    </p>

                    {/* Google Map */}
                    <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-neutral-200">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={zoom}
                            options={mapOptions}
                            onClick={handleMapClick}
                            onLoad={onMapLoad}
                        >
                            <Marker position={selectedLocation} />
                        </GoogleMap>
                    </div>
                </LoadScript>
            </div>

            {/* Selected Location Display */}
            {address && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-green-900 mb-1">Selected Location</h4>
                            <p className="text-sm text-green-700 break-words">{address}</p>
                            <p className="text-xs text-green-600 mt-1 font-mono">
                                📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800 space-y-1">
                        <p className="font-semibold">How to set location:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Click "Auto-Detect My Location" for instant GPS location</li>
                            <li>Search for colleges, landmarks, or addresses</li>
                            <li>Click anywhere on the map to pin exact location</li>
                            <li>Toggle between Street and Satellite views</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
