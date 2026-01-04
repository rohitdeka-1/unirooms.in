import Property from "../Models/property.model.js";
import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import { validationResult } from "express-validator";
import { searchColleges, getCollegeByName, popularColleges } from "../Services/college.service.js";

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
export const getAllProperties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            city,
            roomType,
            gender,
            minPrice,
            maxPrice,
            amenities,
            search,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        // Build filter object
        const filter = { isActive: true }; // Show all active properties (verified or not)

        if (city) filter.city = { $regex: city, $options: "i" };
        if (roomType) filter.roomType = roomType;
        if (gender) filter.gender = { $in: [gender, "any"] };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (amenities) {
            const amenitiesArray = amenities.split(",");
            filter.amenities = { $all: amenitiesArray };
        }
        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = order === "asc" ? 1 : -1;

        const skip = (Number(page) - 1) * Number(limit);

        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone profileImage")
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        const total = await Property.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                properties,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        console.error("Get Properties Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching properties",
            error: error.message,
        });
    }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("landlordId", "name email phone profileImage");

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Increment view count
        await property.incrementViews();

        res.status(200).json({
            success: true,
            data: { property },
        });
    } catch (error) {
        console.error("Get Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching property",
            error: error.message,
        });
    }
};

// @desc    Get landlord's properties
// @route   GET /api/properties/landlord/my-properties
// @access  Private (Landlord)
export const getLandlordProperties = async (req, res) => {
    try {
        const properties = await Property.find({ landlordId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { properties },
        });
    } catch (error) {
        console.error("Get Landlord Properties Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching your properties",
            error: error.message,
        });
    }
};

// @desc    Create new property (requires payment)
// @route   POST /api/properties
// @access  Private (Landlord)
export const createProperty = async (req, res) => {
    try {
        // Validation check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        // Check if user is landlord
        if (req.user.role !== "landlord") {
            return res.status(403).json({
                success: false,
                message: "Only landlords can create properties",
            });
        }

        const { paymentId } = req.body;

        // Verify payment for this property listing
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Payment not found. Please complete payment first.",
                requiresPayment: true,
            });
        }

        if (payment.status !== "success") {
            return res.status(400).json({
                success: false,
                message: "Payment not confirmed. Please complete payment.",
                requiresPayment: true,
            });
        }

        if (payment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // Check if payment already used for a property
        const existingProperty = await Property.findOne({ paymentId });
        if (existingProperty) {
            return res.status(400).json({
                success: false,
                message: "This payment has already been used for a property listing",
            });
        }

        // Use nearbyColleges directly from frontend (landlord selects which campus the property is near)
        const nearbyColleges = req.body.nearbyColleges || [];

        // Validate that at least one college is selected
        if (nearbyColleges.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one nearby campus",
            });
        }

        // Create property
        const propertyData = {
            ...req.body,
            landlordId: req.user.id,
            paymentId,
            nearbyColleges, // Campuses selected by landlord
        };

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: { property, nearbyColleges },
        });
    } catch (error) {
        console.error("Create Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating property",
            error: error.message,
        });
    }
};

// Helper function to calculate nearby colleges within 10km
function calculateNearbyColleges(lat, lon, maxDistance = 10) {
    const nearby = popularColleges
        .map((college) => {
            const distance = calculateDistance(
                lat,
                lon,
                college.location.coordinates[1],
                college.location.coordinates[0]
            );
            return {
                name: college.shortName || college.name,
                distance: parseFloat(distance.toFixed(2)),
            };
        })
        .filter((college) => college.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Top 5 nearest colleges

    return nearby;
}

// @desc    Get nearby colleges for a location (preview)
// @route   GET /api/properties/nearby-colleges?lat=<lat>&lon=<lon>
// @access  Public
export const getNearbyCollegesForLocation = async (req, res) => {
    try {
        const { lat, lon, maxDistance = 10 } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        const nearbyColleges = calculateNearbyColleges(
            parseFloat(lat),
            parseFloat(lon),
            parseFloat(maxDistance)
        );

        res.status(200).json({
            success: true,
            data: { nearbyColleges },
        });
    } catch (error) {
        console.error("Get Nearby Colleges Error:", error);
        res.status(500).json({
            success: false,
            message: "Error finding nearby colleges",
            error: error.message,
        });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Landlord - own properties only)
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Check ownership
        if (property.landlordId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own properties",
            });
        }

        // Don't allow updating landlordId or paymentId
        delete req.body.landlordId;
        delete req.body.paymentId;

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: { property: updatedProperty },
        });
    } catch (error) {
        console.error("Update Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating property",
            error: error.message,
        });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Landlord - own properties only)
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Check ownership
        if (property.landlordId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own properties",
            });
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
        });
    } catch (error) {
        console.error("Delete Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting property",
            error: error.message,
        });
    }
};

// @desc    Toggle property active status
// @route   PATCH /api/properties/:id/toggle-active
// @access  Private (Landlord - own properties only)
export const togglePropertyStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Check ownership
        if (property.landlordId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own properties",
            });
        }

        property.isActive = !property.isActive;
        await property.save();

        res.status(200).json({
            success: true,
            message: `Property ${property.isActive ? "activated" : "deactivated"} successfully`,
            data: { property },
        });
    } catch (error) {
        console.error("Toggle Property Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating property status",
            error: error.message,
        });
    }
};

// @desc    Get landlord dashboard stats
// @route   GET /api/properties/landlord/stats
// @access  Private (Landlord)
export const getLandlordStats = async (req, res) => {
    try {
        const properties = await Property.find({ landlordId: req.user.id });

        const stats = {
            totalProperties: properties.length,
            activeProperties: properties.filter((p) => p.isActive).length,
            totalViews: properties.reduce((sum, p) => sum + p.views, 0),
            totalContactRequests: properties.reduce((sum, p) => sum + p.contactRequests, 0),
            verifiedProperties: properties.filter((p) => p.isVerified).length,
            pendingVerification: properties.filter((p) => !p.isVerified).length,
        };

        res.status(200).json({
            success: true,
            data: { stats },
        });
    } catch (error) {
        console.error("Get Landlord Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching stats",
            error: error.message,
        });
    }
};

// @desc    Search colleges by name
// @route   GET /api/properties/colleges/search
// @access  Public
export const searchCollegesAPI = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters",
            });
        }

        const colleges = searchColleges(query);

        res.status(200).json({
            success: true,
            data: { colleges },
        });
    } catch (error) {
        console.error("Search Colleges Error:", error);
        res.status(500).json({
            success: false,
            message: "Error searching colleges",
            error: error.message,
        });
    }
};

// @desc    Get properties near a college
// @route   GET /api/properties/near-college
// @access  Public
export const getPropertiesNearCollege = async (req, res) => {
    try {
        const {
            collegeName,
            maxDistance = 5, // default 5km radius
            page = 1,
            limit = 10,
            roomType,
            gender,
            minPrice,
            maxPrice,
            amenities,
            sortBy = "distance",
            order = "asc",
        } = req.query;

        if (!collegeName) {
            return res.status(400).json({
                success: false,
                message: "College name is required",
            });
        }

        // Find college
        const college = getCollegeByName(collegeName);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: "College not found",
            });
        }

        // Build filter object
        const filter = { isActive: true }; // Show all active properties (verified or not)

        if (roomType) filter.roomType = roomType;
        if (gender) filter.gender = { $in: [gender, "any"] };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (amenities) {
            const amenitiesArray = amenities.split(",");
            filter.amenities = { $all: amenitiesArray };
        }

        // Use $geoWithin with $centerSphere for radius search (compatible with all MongoDB versions)
        // Convert distance from km to radians (divide by Earth's radius in km)
        const radiusInRadians = Number(maxDistance) / 6371;

        filter.location = {
            $geoWithin: {
                $centerSphere: [
                    college.location.coordinates, // [longitude, latitude]
                    radiusInRadians
                ]
            }
        };

        // Find all properties within radius (no pagination initially for distance sorting)
        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone profileImage")
            .lean();

        // Calculate distance for each property
        const propertiesWithDistance = properties.map((property) => {
            const distance = calculateDistance(
                college.location.coordinates[1], // latitude
                college.location.coordinates[0], // longitude
                property.location.coordinates[1],
                property.location.coordinates[0]
            );

            return {
                ...property,
                distance: distance * 1000, // convert to meters
                distanceInKm: parseFloat(distance.toFixed(2)),
                landlord: property.landlordId,
            };
        });

        // Sort by distance
        propertiesWithDistance.sort((a, b) => a.distance - b.distance);

        // Apply pagination after sorting
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedProperties = propertiesWithDistance.slice(skip, skip + Number(limit));

        res.status(200).json({
            success: true,
            data: {
                college: {
                    name: college.name,
                    shortName: college.shortName,
                    city: college.address.city,
                    state: college.address.state,
                },
                properties: paginatedProperties,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: propertiesWithDistance.length,
                    pages: Math.ceil(propertiesWithDistance.length / Number(limit)),
                },
                searchRadius: `${maxDistance}km`,
            },
        });
    } catch (error) {
        console.error("Get Properties Near College Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching properties near college",
            error: error.message,
        });
    }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

