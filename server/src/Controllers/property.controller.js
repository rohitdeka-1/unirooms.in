import Property from "../Models/property.model.js";
import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import { validationResult } from "express-validator";
import { searchColleges, getCollegeByName, popularColleges } from "../Services/college.service.js";
import { sendNewPropertyNotification } from "../Services/email.service.js";
import cloudinary from "../Config/cloudinary.config.js";
import streamifier from 'streamifier';

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

        // Validate campus name is provided
        if (!req.body.campusName) {
            return res.status(400).json({
                success: false,
                message: "Please select a campus for this property",
            });
        }

        // Handle image uploads to Cloudinary
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            // Limit to 5 images
            const filesToUpload = req.files.slice(0, 5);
            
            const uploadPromises = filesToUpload.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'properties',
                            transformation: [
                                { width: 1200, height: 800, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve({
                                url: result.secure_url,
                                publicId: result.public_id
                            });
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            try {
                uploadedImages = await Promise.all(uploadPromises);
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading images. Please try again.",
                });
            }
        }

        // Create property
        const propertyData = {
            ...req.body,
            landlordId: req.user.id,
            paymentId,
            images: uploadedImages.length > 0 ? uploadedImages : []
        };

        const property = await Property.create(propertyData);

        // Send notification email to admin
        try {
            const landlord = await User.findById(req.user.id);
            await sendNewPropertyNotification({
                title: property.title,
                landlordName: landlord.name,
                landlordEmail: landlord.email,
                city: property.city,
                price: property.price,
                propertyId: property._id,
            });
        } catch (emailError) {
            console.error("Failed to send admin notification:", emailError);
            // Don't fail the property creation if email fails
        }

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: { property },
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

// @desc    Get all available campuses (for dropdown selection)
// @route   GET /api/properties/campuses
// @access  Public
export const getAllCampuses = async (req, res) => {
    try {
        // Return list of all campuses for selection
        const campuses = popularColleges.map(college => ({
            name: college.shortName || college.name,
            fullName: college.name,
            city: college.address.city,
            state: college.address.state,
            type: college.type
        }));

        res.status(200).json({
            success: true,
            data: { campuses },
        });
    } catch (error) {
        console.error("Get Campuses Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching campuses",
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

        // Handle new image uploads to Cloudinary
        let newImages = [];
        if (req.files && req.files.length > 0) {
            // Calculate how many images we can add
            const existingImagesCount = property.images?.length || 0;
            const availableSlots = 5 - existingImagesCount;
            const filesToUpload = req.files.slice(0, availableSlots);
            
            if (filesToUpload.length > 0) {
                const uploadPromises = filesToUpload.map(file => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'properties',
                                transformation: [
                                    { width: 1200, height: 800, crop: 'limit' },
                                    { quality: 'auto:good' }
                                ]
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve({
                                    url: result.secure_url,
                                    publicId: result.public_id
                                });
                            }
                        );
                        streamifier.createReadStream(file.buffer).pipe(uploadStream);
                    });
                });

                try {
                    newImages = await Promise.all(uploadPromises);
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    return res.status(500).json({
                        success: false,
                        message: "Error uploading images. Please try again.",
                    });
                }
            }
        }

        // Don't allow updating landlordId or paymentId
        delete req.body.landlordId;
        delete req.body.paymentId;

        // Merge new images with existing ones
        const updateData = {
            ...req.body,
        };
        
        if (newImages.length > 0) {
            updateData.images = [...(property.images || []), ...newImages];
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
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
            page = 1,
            limit = 10,
            roomType,
            gender,
            minPrice,
            maxPrice,
            amenities,
            sortBy = "price",
            order = "asc",
        } = req.query;

        if (!collegeName) {
            return res.status(400).json({
                success: false,
                message: "College name is required",
            });
        }

        // Find college to verify it exists
        const college = getCollegeByName(collegeName);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: "College not found",
            });
        }

        // Build filter object
        const filter = {
            isActive: true,
            // Match properties where nearbyColleges array contains this campus name
            "nearbyColleges.name": {
                $regex: new RegExp(`^${college.name}$|^${college.shortName}$`, 'i')
            }
        };

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

        // Count total matching properties
        const total = await Property.countDocuments(filter);

        // Find properties with pagination
        const skip = (Number(page) - 1) * Number(limit);
        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone profileImage")
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        // Format response
        const formattedProperties = properties.map((property) => ({
            ...property,
            landlord: property.landlordId,
        }));

        res.status(200).json({
            success: true,
            data: {
                college: {
                    name: college.name,
                    shortName: college.shortName,
                    city: college.address.city,
                    state: college.address.state,
                },
                properties: formattedProperties,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
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

// @desc    Get all properties (Admin only)
// @route   GET /api/properties/admin/all
// @access  Private (Admin)
export const getAllPropertiesAdmin = async (req, res) => {
    try {
        const { status } = req.query; // 'pending', 'verified', 'all'
        
        let filter = {};
        if (status === 'pending') {
            filter.isVerified = false;
        } else if (status === 'verified') {
            filter.isVerified = true;
        }

        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { properties },
        });
    } catch (error) {
        console.error("Get All Properties Admin Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching properties",
            error: error.message,
        });
    }
};

// @desc    Approve property (Admin only)
// @route   PUT /api/properties/admin/:id/approve
// @access  Private (Admin)
export const approveProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        property.isVerified = true;
        await property.save();

        res.status(200).json({
            success: true,
            message: "Property approved successfully",
            data: { property },
        });
    } catch (error) {
        console.error("Approve Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error approving property",
            error: error.message,
        });
    }
};

// @desc    Decline/Delete property (Admin only)
// @route   DELETE /api/properties/admin/:id/decline
// @access  Private (Admin)
export const declineProperty = async (req, res) => {
    try {
        const { reason } = req.body;
        const property = await Property.findById(req.params.id).populate("landlordId", "name email");

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Delete the property
        await Property.findByIdAndDelete(req.params.id);

        // Optionally send email to landlord about rejection
        // You can implement this later if needed

        res.status(200).json({
            success: true,
            message: "Property declined and removed",
        });
    } catch (error) {
        console.error("Decline Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error declining property",
            error: error.message,
        });
    }
};

