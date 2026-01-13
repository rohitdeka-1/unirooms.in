import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import { propertyAPI } from '../utils/api';
import { updateMetaTags, generateBreadcrumbStructuredData, addStructuredData, generateFAQStructuredData } from '../utils/seo';

// College data with SEO-rich information
const collegeData = {
    'vit-bhopal': {
        name: 'VIT Bhopal',
        fullName: 'Vellore Institute of Technology, Bhopal',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        description: 'Find the best PG accommodations near VIT Bhopal. Safe, verified, and affordable paying guest options for boys and girls within walking distance of Vellore Institute of Technology, Bhopal campus.',
        longDescription: 'VIT Bhopal University is one of the premier engineering institutions in Madhya Pradesh. Students studying at VIT Bhopal need comfortable and affordable accommodation nearby. Our platform offers verified PG options including boys PG, girls PG, and co-living spaces near VIT Bhopal with modern amenities like WiFi, meals, laundry, and 24/7 security.',
        searchKeywords: 'vit bhopal,VIT Bhopal',
        amenities: ['WiFi', 'Meals', 'Laundry', 'AC Rooms', '24/7 Security', 'Power Backup'],
        nearbyPlaces: ['VIT Bhopal Main Gate', 'Kothri Kalan', 'Sehore Road', 'Ashta'],
        coordinates: { lat: 23.0893, lng: 77.6858 },
        avgRent: '4000-8000',
        faqs: [
            {
                question: 'What is the average rent for PG near VIT Bhopal?',
                answer: 'PG rents near VIT Bhopal typically range from ₹4,000 to ₹8,000 per month depending on sharing type and amenities. Single rooms cost ₹6,000-8,000, double sharing ₹4,500-6,000, and triple sharing ₹4,000-5,000 per month.'
            },
            {
                question: 'How far are the PGs from VIT Bhopal campus?',
                answer: 'Most PGs are located within 1-3 km from VIT Bhopal campus. Many are within walking distance (10-15 minutes), while others are easily accessible by bike or local transport within 5-10 minutes.'
            },
            {
                question: 'Are there separate PGs for boys and girls near VIT Bhopal?',
                answer: 'Yes, we have separate PG accommodations for boys and girls near VIT Bhopal. We also have co-living spaces with separate floors for boys and girls with proper security measures.'
            },
            {
                question: 'What facilities are included in VIT Bhopal PGs?',
                answer: 'Most PGs near VIT Bhopal include WiFi, meals (2-3 times), laundry service, housekeeping, 24/7 security, power backup, water supply, and common amenities like TV, refrigerator, and washing machine.'
            }
        ]
    },
    'vit-vellore': {
        name: 'VIT Vellore',
        fullName: 'Vellore Institute of Technology, Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        description: 'Discover verified PG accommodations near VIT Vellore. Comfortable and affordable paying guest options for students with excellent amenities and security near Vellore Institute of Technology campus.',
        longDescription: 'VIT Vellore is one of India\'s top engineering institutions located in Tamil Nadu. With thousands of students, finding quality PG accommodation near VIT Vellore is essential. We offer verified listings for boys PG, girls PG, and co-living spaces with amenities like AC, WiFi, nutritious meals, and 24/7 security.',
        searchKeywords: 'vit vellore,VIT Vellore',
        amenities: ['WiFi', 'AC Rooms', 'Meals', 'Laundry', 'Security', 'Gym Access'],
        nearbyPlaces: ['VIT Main Campus', 'Katpadi', 'Gandhi Nagar', 'Thorapadi'],
        coordinates: { lat: 12.9698, lng: 79.1591 },
        avgRent: '5000-10000',
        faqs: [
            {
                question: 'What is the average rent for PG near VIT Vellore?',
                answer: 'PG accommodations near VIT Vellore range from ₹5,000 to ₹10,000 per month. Single rooms cost around ₹8,000-10,000, double sharing ₹6,000-7,500, and triple sharing ₹5,000-6,000 with meals and amenities.'
            },
            {
                question: 'Is food included in VIT Vellore PG rent?',
                answer: 'Most PGs near VIT Vellore include 2-3 meals per day in the rent. The food is typically South Indian and North Indian cuisine. Some PGs also offer special meal plans and dietary options.'
            },
            {
                question: 'How safe are PGs near VIT Vellore for girls?',
                answer: 'Safety is a priority for all our listed PGs near VIT Vellore. Girls PGs have 24/7 security guards, CCTV surveillance, biometric access, and strict visitor policies to ensure complete safety.'
            },
            {
                question: 'Can I visit the PG before booking near VIT Vellore?',
                answer: 'Yes, we highly recommend visiting the PG in person before booking. Contact the property owner through our platform to schedule a visit and inspect the facilities, rooms, and location.'
            }
        ]
    },
    'vit-chennai': {
        name: 'VIT Chennai',
        fullName: 'Vellore Institute of Technology, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        description: 'Find premium PG accommodations near VIT Chennai. Verified paying guest options with modern amenities for VIT Chennai students in safe and convenient locations.',
        longDescription: 'VIT Chennai campus offers quality education in a metropolitan setting. Students need reliable PG accommodation that provides comfort and convenience. Our verified listings include boys hostels, girls PG, and shared accommodations near VIT Chennai with WiFi, AC, meals, and excellent connectivity.',
        searchKeywords: 'vit chennai,VIT Chennai',
        amenities: ['WiFi', 'AC', 'Food', 'Laundry', 'Security', 'Transport'],
        nearbyPlaces: ['VIT Chennai Campus', 'Vandalur', 'Kelambakkam', 'OMR'],
        coordinates: { lat: 12.8407, lng: 80.1548 },
        avgRent: '6000-12000',
        faqs: [
            {
                question: 'What is the cost of PG near VIT Chennai?',
                answer: 'PG rents near VIT Chennai range from ₹6,000 to ₹12,000 per month. Single AC rooms cost ₹10,000-12,000, double sharing ₹7,000-9,000, and triple sharing ₹6,000-7,500 including meals and amenities.'
            },
            {
                question: 'Are there AC PGs available near VIT Chennai?',
                answer: 'Yes, most PGs near VIT Chennai offer AC rooms. AC single rooms, AC double sharing, and even AC triple sharing options are available with varying rent based on amenities and location.'
            },
            {
                question: 'What is the distance from PGs to VIT Chennai campus?',
                answer: 'Most PGs are located within 1-5 km from VIT Chennai campus. Many offer shuttle services or are well-connected by local buses and auto rickshaws for easy commute.'
            },
            {
                question: 'Do VIT Chennai PGs provide WiFi and study areas?',
                answer: 'Yes, almost all PGs near VIT Chennai provide high-speed WiFi, dedicated study tables in rooms, and some even have common study areas for group studies and project work.'
            }
        ]
    },
    'srm-university': {
        name: 'SRM University',
        fullName: 'SRM Institute of Science and Technology',
        city: 'Chennai',
        state: 'Tamil Nadu',
        description: 'Best PG accommodations near SRM University Chennai. Safe and affordable paying guest options for boys and girls with modern facilities close to SRM campus.',
        longDescription: 'SRM University is one of the largest private universities in India. Students need quality accommodation near the campus with good facilities. We provide verified PG listings including boys hostels, girls PG, and co-living spaces near SRM with amenities like WiFi, AC, food, and 24/7 security.',
        searchKeywords: 'srm university,SRM Chennai',
        amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Laundry', 'Parking'],
        nearbyPlaces: ['SRM Main Campus', 'Kattankulathur', 'Potheri', 'Guduvanchery'],
        coordinates: { lat: 12.8230, lng: 80.0414 },
        avgRent: '5000-10000',
        faqs: [
            {
                question: 'What is the rent for PG near SRM University?',
                answer: 'PG accommodations near SRM University range from ₹5,000 to ₹10,000 per month. Pricing depends on sharing type, AC/non-AC, and amenities. Single rooms cost ₹8,000-10,000, while shared rooms range from ₹5,000-7,000.'
            },
            {
                question: 'Are meals provided in SRM University PGs?',
                answer: 'Yes, most PGs near SRM University provide 2-3 meals daily including breakfast, lunch, and dinner. The menu typically includes both South Indian and North Indian dishes with vegetarian and non-vegetarian options.'
            },
            {
                question: 'How far are the PGs from SRM University campus?',
                answer: 'Most PGs are located within 1-3 km of SRM University campus in areas like Kattankulathur, Potheri, and nearby localities. Students can walk, cycle, or take local transport to reach the campus within 10-15 minutes.'
            },
            {
                question: 'Is WiFi available in PGs near SRM University?',
                answer: 'Yes, high-speed WiFi is a standard amenity in most PGs near SRM University. This is essential for students to attend online classes, complete assignments, and stay connected.'
            }
        ]
    },
    'iit-delhi': {
        name: 'IIT Delhi',
        fullName: 'Indian Institute of Technology, Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        description: 'Premium PG accommodations near IIT Delhi. Verified and comfortable paying guest options for students and professionals near Hauz Khas with excellent amenities.',
        longDescription: 'IIT Delhi is located in South Delhi near Hauz Khas. Finding quality PG accommodation near IIT Delhi requires careful consideration of safety, amenities, and connectivity. We offer verified listings for boys and girls PG near IIT Delhi with modern facilities and secure environments.',
        searchKeywords: 'iit delhi,IIT Delhi',
        amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Metro Access', 'Laundry'],
        nearbyPlaces: ['Hauz Khas', 'Green Park', 'IIT Gate', 'Safdarjung'],
        coordinates: { lat: 28.5450, lng: 77.1925 },
        avgRent: '8000-15000',
        faqs: [
            {
                question: 'What is the rent for PG near IIT Delhi?',
                answer: 'PG rents near IIT Delhi range from ₹8,000 to ₹15,000 per month due to the premium location in South Delhi. Single rooms cost ₹12,000-15,000, double sharing ₹9,000-11,000, and triple sharing ₹8,000-10,000.'
            },
            {
                question: 'Which areas are best for PG near IIT Delhi?',
                answer: 'The best areas for PG near IIT Delhi are Hauz Khas, Green Park, Safdarjung Enclave, and Ber Sarai. These locations offer easy access to the campus and are well-connected by Delhi Metro.'
            },
            {
                question: 'Are PGs near IIT Delhi safe for girls?',
                answer: 'Yes, there are many safe PGs for girls near IIT Delhi with 24/7 security, CCTV surveillance, and strict entry policies. South Delhi is relatively safe, and most PGs follow strict safety protocols.'
            },
            {
                question: 'Is food included in IIT Delhi PG rent?',
                answer: 'Food inclusion varies by PG. Some include meals in the rent while others charge separately. Most PGs offer meal plans ranging from ₹3,000-5,000 per month for 3 meals a day.'
            }
        ]
    },
    'iit-bombay': {
        name: 'IIT Bombay',
        fullName: 'Indian Institute of Technology, Bombay',
        city: 'Mumbai',
        state: 'Maharashtra',
        description: 'Find verified PG accommodations near IIT Bombay Powai. Safe and comfortable paying guest options for students with modern amenities in Mumbai.',
        longDescription: 'IIT Bombay in Powai is one of India\'s top engineering institutions. Students and researchers need quality accommodation near the campus. We provide verified PG listings in Powai, Kanjurmarg, and nearby areas with excellent facilities and connectivity.',
        searchKeywords: 'iit bombay,IIT Bombay,IIT Powai',
        amenities: ['WiFi', 'AC', 'Food', 'Security', 'Laundry', 'Parking'],
        nearbyPlaces: ['Powai', 'Kanjurmarg', 'Vikhroli', 'IIT Main Gate'],
        coordinates: { lat: 19.1334, lng: 72.9128 },
        avgRent: '10000-20000',
        faqs: [
            {
                question: 'What is the cost of PG near IIT Bombay?',
                answer: 'PG rents near IIT Bombay range from ₹10,000 to ₹20,000 per month due to Mumbai\'s premium real estate. Single AC rooms cost ₹15,000-20,000, double sharing ₹12,000-15,000, and triple sharing ₹10,000-12,000.'
            },
            {
                question: 'Which areas are best for PG near IIT Bombay?',
                answer: 'Powai, Kanjurmarg, Vikhroli, and Chandivali are the best areas for PG near IIT Bombay. Powai is closest but expensive, while Kanjurmarg offers more affordable options with good connectivity.'
            },
            {
                question: 'Is local train access available from PGs near IIT Bombay?',
                answer: 'Yes, areas like Kanjurmarg and Vikhroli have railway stations on the Central Line. Many PGs are located near these stations, making it easy to travel across Mumbai.'
            },
            {
                question: 'Do PGs near IIT Bombay include food?',
                answer: 'Many PGs near IIT Bombay include meals in the rent, while some offer optional meal plans. Expect to pay ₹4,000-6,000 per month for 3 meals per day if not included in the base rent.'
            }
        ]
    }
};

const CollegeLanding = () => {
    const { collegeSlug } = useParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const college = collegeData[collegeSlug];

    useEffect(() => {
        // If college not found, redirect to browse page
        if (!college) {
            navigate('/browse');
            return;
        }

        // Update meta tags for SEO
        updateMetaTags({
            title: `PG Near ${college.name} | Best Accommodation Near ${college.fullName} | Unirooms`,
            description: college.description,
            keywords: `pg near ${college.name.toLowerCase()}, ${college.name.toLowerCase()} pg, boys pg near ${college.name.toLowerCase()}, girls pg near ${college.name.toLowerCase()}, hostel near ${college.name.toLowerCase()}, accommodation near ${college.name.toLowerCase()}, paying guest ${college.city.toLowerCase()}, student accommodation ${college.name.toLowerCase()}`,
            url: `https://unirooms.in/college/${collegeSlug}`
        });

        // Add breadcrumb structured data
        const breadcrumbs = [
            { name: 'Home', url: '/' },
            { name: 'Colleges', url: '/browse' },
            { name: `PG Near ${college.name}`, url: `/college/${collegeSlug}` }
        ];
        addStructuredData(generateBreadcrumbStructuredData(breadcrumbs));

        // Add FAQ structured data
        if (college.faqs && college.faqs.length > 0) {
            addStructuredData(generateFAQStructuredData(college.faqs));
        }
    }, [collegeSlug, college, navigate]);

    useEffect(() => {
        if (!college) return;

        const fetchProperties = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await propertyAPI.getAllProperties({
                    search: college.searchKeywords,
                    limit: 20
                });
                
                if (response.success) {
                    setProperties(response.data.properties || []);
                }
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError('Failed to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [college]);

    if (!college) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <nav className="text-sm mb-6 opacity-90">
                            <Link to="/" className="hover:underline">Home</Link>
                            <span className="mx-2">/</span>
                            <Link to="/browse" className="hover:underline">Browse</Link>
                            <span className="mx-2">/</span>
                            <span>PG Near {college.name}</span>
                        </nav>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            PG Near {college.name}
                        </h1>
                        <h2 className="text-xl md:text-2xl mb-6 opacity-90">
                            Best Accommodation Near {college.fullName}
                        </h2>
                        <p className="text-lg md:text-xl mb-8 opacity-95 leading-relaxed">
                            {college.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">{properties.length}+</div>
                                <div className="text-sm opacity-90">Available PGs</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">₹{college.avgRent}</div>
                                <div className="text-sm opacity-90">Rent Range</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">Verified</div>
                                <div className="text-sm opacity-90">All Listings</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm opacity-90">Support</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                            About PG Accommodation Near {college.name}
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-neutral-700 leading-relaxed mb-6">
                                {college.longDescription}
                            </p>
                            
                            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                                Popular Amenities in {college.name} PGs
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                {college.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-neutral-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                                Popular Areas Near {college.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {college.nearbyPlaces.map((place, index) => (
                                    <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                                        {place}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Properties Listing */}
            <section className="py-12 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
                        Available PG Accommodations Near {college.name}
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-neutral-600">Loading properties...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600 mb-4">No properties found near {college.name}</p>
                            <Link 
                                to="/browse" 
                                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Browse All Properties
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            {college.faqs && college.faqs.length > 0 && (
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 text-center">
                                Frequently Asked Questions - PG Near {college.name}
                            </h2>
                            <div className="space-y-4">
                                {college.faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-lg shadow-md p-6"
                                    >
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                                            {faq.question}
                                        </h3>
                                        <p className="text-neutral-700 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Find Your Perfect PG Near {college.name}?
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Browse verified listings or contact us for personalized assistance
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to={`/browse?search=${encodeURIComponent(college.searchKeywords)}`}
                            className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                        >
                            View All Properties
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CollegeLanding;
