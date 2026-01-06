import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(
        initialLocation || { lat: 28.6139, lng: 77.2090 } // Default: New Delhi
    );
    const [address, setAddress] = useState('');
    const [mapStyle, setMapStyle] = useState('satellite-v9'); // 'streets-v12' or 'satellite-v9'
    const [isLocating, setIsLocating] = useState(false);

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    // Initialize map
    useEffect(() => {
        if (map.current) return; // Initialize map only once

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: `mapbox://styles/mapbox/${mapStyle}`,
            center: [selectedLocation.lng, selectedLocation.lat],
            zoom: 18,
            pitch: 0
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add geocoder (search)
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            countries: 'in',
            placeholder: 'Search location...',
            types: 'poi,address,place',
        });

        map.current.addControl(geocoder, 'top-left');

        // Handle geocoder result
        geocoder.on('result', (e) => {
            const coords = e.result.geometry.coordinates;
            updateLocation(coords[1], coords[0], e.result.place_name);
        });

        // Create marker
        marker.current = new mapboxgl.Marker({
            draggable: true,
            color: '#10b981'
        })
            .setLngLat([selectedLocation.lng, selectedLocation.lat])
            .addTo(map.current);

        // Handle marker drag
        marker.current.on('dragend', async () => {
            const lngLat = marker.current.getLngLat();
            await updateLocation(lngLat.lat, lngLat.lng);
            // Center map on marker after drag
            map.current.easeTo({
                center: [lngLat.lng, lngLat.lat],
                duration: 300
            });
        });

        // Handle map click
        map.current.on('click', async (e) => {
            const { lat, lng } = e.lngLat;
            await updateLocation(lat, lng);
            // Smoothly move marker to clicked location
            if (marker.current) {
                marker.current.setLngLat([lng, lat]);
            }
            // Center on clicked location with slight zoom
            map.current.easeTo({
                center: [lng, lat],
                zoom: 19,
                duration: 500
            });
        });

    }, []);

    // Update map style when changed
    useEffect(() => {
        if (map.current) {
            map.current.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
        }
    }, [mapStyle]);

    // Reverse geocode to get address
    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&country=in`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                return data.features[0].place_name;
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return '';
    };

    // Update location
    const updateLocation = async (lat, lng, addr = null) => {
        const newLocation = { lat, lng };
        setSelectedLocation(newLocation);

        // Update marker position
        if (marker.current) {
            marker.current.setLngLat([lng, lat]);
        }

        // Get address if not provided
        const address = addr || await reverseGeocode(lat, lng);
        setAddress(address);

        // Callback to parent
        if (onLocationSelect) {
            onLocationSelect({
                coordinates: [lng, lat],
                address: address
            });
        }
    };

    // Auto-detect location
    const handleAutoDetect = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                await updateLocation(lat, lng);
                
                // Fly to location with higher zoom for precision
                if (map.current) {
                    map.current.flyTo({
                        center: [lng, lat],
                        zoom: 19,
                        pitch: 0,
                        bearing: 0,
                        essential: true,
                        duration: 2000
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

    return (
        <div className="space-y-4">
            {/* Auto-Detect Button */}
            <button
                type="button"
                onClick={handleAutoDetect}
                disabled={isLocating}
                className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLocating ? (
                    <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Detecting Location...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Use My Current Location</span>
                    </>
                )}
            </button>

            {/* Map Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="flex-1 text-sm text-neutral-600">
                    Search or click map to select location
                </div>
                
                <div className="flex bg-neutral-100 rounded-lg p-1 gap-1 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setMapStyle('streets-v12')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            mapStyle === 'streets-v12'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-neutral-600'
                        }`}
                    >
                        Street
                    </button>
                    <button
                        type="button"
                        onClick={() => setMapStyle('satellite-v9')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            mapStyle === 'satellite-v9'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-neutral-600'
                        }`}
                    >
                        Satellite
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div 
                ref={mapContainer} 
                className="relative rounded-lg overflow-hidden shadow-md border border-neutral-200"
                style={{ height: '400px' }}
            />

            {/* Selected Location Display */}
            {address && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-green-900 mb-1">Selected Location</p>
                            <p className="text-sm text-green-700 break-words">{address}</p>
                            <p className="text-xs text-green-600 mt-1 font-mono">
                                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900 font-medium mb-1">Quick Guide:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use search bar to find colleges or addresses</li>
                    <li>• Click on map to pin exact location</li>
                    <li>• Drag marker to adjust position</li>
                </ul>
            </div>
        </div>
    );
};

export default LocationPicker;
