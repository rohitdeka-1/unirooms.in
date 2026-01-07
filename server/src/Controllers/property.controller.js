import Property from "../Models/property.model.js";
import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import { validationResult } from "express-validator";
import { searchColleges, getCollegeByName, popularColleges } from "../Services/college.service.js";
import { sendNewPropertyNotification } from "../Services/email.service.js";
import cloudinary from "../Config/cloudinary.config.js";
import streamifier from 'streamifier';

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

        const filter = { isActive: true, isVerified: true };

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

        if (!property.isVerified && (!req.user || req.user.id !== property.landlordId.toString())) {
            return res.status(404).json({
                success: false,
                message: "Property not found or not yet approved",
            });
        }

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

export const getLandlordProperties = async (req, res) => {
    try {
        const properties = await Property.find({ landlordId: req.user.id })
            .sort({ createdAt: -1 });

        const totalSuccessfulPayments = await Payment.countDocuments({
            userId: req.user.id,
            status: "success",
            purpose: "property_listing",
        });

        const activePropertiesCount = properties.length;
        const availableCredits = totalSuccessfulPayments - activePropertiesCount;

        res.status(200).json({
            success: true,
            data: { 
                properties,
                credits: {
                    total: totalSuccessfulPayments,
                    used: activePropertiesCount,
                    available: availableCredits,
                }
            },
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

export const createProperty = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        if (req.user.role !== "landlord") {
            return res.status(403).json({
                success: false,
                message: "Only landlords can create properties",
            });
        }

        // Calculate total listing credits from successful payments
        const successfulPayments = await Payment.find({
            userId: req.user.id,
            status: "success",
            purpose: "property_listing",
        });
        
        const totalPaidCredits = successfulPayments.reduce((sum, payment) => {
            return sum + (payment.propertiesCount || 1);
        }, 0);

        // Count total properties ever created (including deleted ones)
        const totalPropertiesCreated = await Property.countDocuments({
            landlordId: req.user.id,
        });

        const remainingCredits = totalPaidCredits - totalPropertiesCreated;

        if (remainingCredits <= 0) {
            const activePropertiesCount = await Property.countDocuments({
                landlordId: req.user.id,
                isActive: true,
            });
            
            return res.status(400).json({
                success: false,
                message: `You have used all your listing credits. You have paid for ${totalPaidCredits} listings and created ${totalPropertiesCreated} properties (${activePropertiesCount} currently active). Please make a payment to list more properties.`,
                requiresPayment: true,
                totalPaidCredits: totalPaidCredits,
                totalUsedCredits: totalPropertiesCreated,
                activeProperties: activePropertiesCount,
                remainingCredits: 0,
            });
        }

        if (!req.body.campusName) {
            return res.status(400).json({
                success: false,
                message: "Please select a campus for this property",
            });
        }

        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
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

        const propertyData = {
            ...req.body,
            landlordId: req.user.id,
            images: uploadedImages.length > 0 ? uploadedImages : []
        };

        const property = await Property.create(propertyData);

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

export const getAllCampuses = async (req, res) => {
    try {
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

export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        
        if (property.landlordId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own properties",
            });
        }

        let newImages = [];
        if (req.files && req.files.length > 0) {
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

        delete req.body.landlordId;
        delete req.body.paymentId;

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

export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

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

export const togglePropertyStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

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

        const college = getCollegeByName(collegeName);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: "College not found",
            });
        }

        const filter = {
            isActive: true,
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

        const total = await Property.countDocuments(filter);

        const skip = (Number(page) - 1) * Number(limit);
        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone profileImage")
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

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

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
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

export const getAllPropertiesAdmin = async (req, res) => {
    try {
        const { status } = req.query;
        
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

        await Property.findByIdAndDelete(req.params.id);

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

