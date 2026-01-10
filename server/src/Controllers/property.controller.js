import Property from "../Models/property.model.js";
import Payment from "../Models/payment.model.js";
import User from "../Models/user.model.js";
import { validationResult } from "express-validator";
import { searchColleges, getCollegeByName, popularColleges } from "../Services/college.service.js";
import { sendNewPropertyNotification, sendPropertyDeclineEmail } from "../Services/email.service.js";
import cloudinary from "../Config/cloudinary.config.js";
import streamifier from 'streamifier';

// Helper function to generate optimized Cloudinary URLs
const getOptimizedCloudinaryUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }
    const {
        width = 800,
        quality = 'auto:good',
        format = 'auto'
    } = options;
    
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    const transformations = [
        `w_${width}`,
        `q_${quality}`,
        `f_${format}`,
        'c_fill',
        'g_auto',
        'dpr_auto',
        'fl_progressive',
        'fl_lossy'
    ].join(',');
    
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

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
            // Use $or with regex for flexible search across multiple fields
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
                { campusName: { $regex: search, $options: "i" } },
                { "address.locality": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } },
            ];
        }

        const sortObj = {};
        sortObj[sortBy] = order === "asc" ? 1 : -1;

        const skip = (Number(page) - 1) * Number(limit);

        // Execute queries in parallel for faster response
        const [properties, total] = await Promise.all([
            Property.find(filter)
                .populate("landlordId", "name email phone profileImage")
                .sort(sortObj)
                .skip(skip)
                .limit(Number(limit))
                .lean(), // Use lean() for faster queries
            Property.countDocuments(filter)
        ]);

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
        // Execute queries in parallel for faster response
        const [properties, totalSuccessfulPayments] = await Promise.all([
            Property.find({ landlordId: req.user.id })
                .sort({ createdAt: -1 })
                .lean(), // Use lean() for faster queries
            Payment.countDocuments({
                userId: req.user.id,
                status: "success",
                purpose: "property_listing",
            })
        ]);

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

        // Count ONLY current properties in database (deleted properties are gone)
        const currentPropertiesCount = await Property.countDocuments({
            landlordId: req.user.id,
        });

        if (currentPropertiesCount >= totalPaidCredits) {
            return res.status(400).json({
                success: false,
                message: `You have reached your listing limit. You have paid for ${totalPaidCredits} listings and currently have ${currentPropertiesCount} properties. Please make a payment to list more properties.`,
                requiresPayment: true,
                totalPaidCredits: totalPaidCredits,
                currentProperties: currentPropertiesCount,
                remainingCredits: totalPaidCredits - currentPropertiesCount,
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
            console.log(`Uploading ${filesToUpload.length} images to Cloudinary...`);
            const uploadStart = Date.now();
            
            // Upload images to Cloudinary with parallel processing and timeout protection
            const uploadPromises = filesToUpload.map((file, index) => {
                return new Promise((resolve, reject) => {
                    // Set individual upload timeout (20 seconds per image)
                    const uploadTimeout = setTimeout(() => {
                        reject(new Error(`Upload timeout for image ${index + 1}`));
                    }, 20000);

                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'properties',
                            resource_type: 'auto',
                            // Cloudinary transformations for optimization
                            transformation: [
                                { quality: 'auto:good', fetch_format: 'auto' }
                            ]
                        },
                        (error, result) => {
                            clearTimeout(uploadTimeout);
                            if (error) {
                                console.error(`Upload error for image ${index + 1}:`, error);
                                reject(error);
                            } else {
                                const originalUrl = result.secure_url;
                                console.log(`✓ Image ${index + 1} uploaded: ${result.public_id}`);
                                resolve({
                                    url: getOptimizedCloudinaryUrl(originalUrl, { width: 800 }),
                                    originalUrl: originalUrl,
                                    publicId: result.public_id,
                                    sizes: {
                                        thumb: getOptimizedCloudinaryUrl(originalUrl, { width: 200, quality: 'auto:low' }),
                                        small: getOptimizedCloudinaryUrl(originalUrl, { width: 400 }),
                                        medium: getOptimizedCloudinaryUrl(originalUrl, { width: 800 }),
                                        large: getOptimizedCloudinaryUrl(originalUrl, { width: 1200 }),
                                        card: getOptimizedCloudinaryUrl(originalUrl, { width: 500 })
                                    }
                                });
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            try {
                // Upload all images in parallel - much faster than sequential
                uploadedImages = await Promise.all(uploadPromises);
                const uploadTime = Date.now() - uploadStart;
                console.log(`✓ All ${uploadedImages.length} images uploaded in ${uploadTime}ms`);
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading images. Please try with smaller images or check your internet connection.",
                    error: uploadError.message,
                });
            }
        }

        const propertyData = {
            ...req.body,
            landlordId: req.user.id,
            images: uploadedImages.length > 0 ? uploadedImages : []
        };

        const property = await Property.create(propertyData);

        // Send response IMMEDIATELY
        res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: { property },
        });

        // Send email notification asynchronously AFTER response (fire-and-forget)
        // Using setTimeout to ensure it doesn't block the response
        setTimeout(async () => {
            try {
                const landlord = await User.findById(req.user.id).lean();
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
        }, 0);
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
        delete req.body.existingImages; // Remove this before spreading

        const updateData = {
            ...req.body,
        };
        
        // Remove images field if it exists in req.body (it might be a string from FormData)
        if (updateData.images) {
            delete updateData.images;
        }
        
        // Handle images update
        if (req.body.existingImages && Array.isArray(req.body.existingImages)) {
            // existingImages is already parsed by parseFormData middleware
            const existingImagesToKeep = req.body.existingImages;
            // Start with existing images that weren't removed
            updateData.images = existingImagesToKeep;
            // Append newly uploaded images
            if (newImages.length > 0) {
                updateData.images = [...existingImagesToKeep, ...newImages];
            }
        } else if (newImages.length > 0) {
            // No existing images data, just append new ones (backward compatible)
            updateData.images = [...(property.images || []), ...newImages];
        }
        // If no new images and no existing images update, keep original images
        else if (!updateData.images) {
            updateData.images = property.images;
        }

        // Build update query
        const updateQuery = { $set: updateData };

        // If property was declined, reset status to pending when landlord updates it
        if (property.status === "declined") {
            updateQuery.$set.status = "pending";
            updateQuery.$set.isActive = true;
            updateQuery.$unset = { declineReason: "", declinedAt: "" };
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateQuery,
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
            // Only show properties that are pending (not declined)
            filter.$or = [
                { status: 'pending' },
                { status: { $exists: false } } // For backward compatibility with old properties
            ];
            filter.isVerified = false;
        } else if (status === 'verified') {
            filter.isVerified = true;
        }
        // For 'all' status, we still exclude declined properties
        else {
            filter.status = { $ne: 'declined' };
        }

        const properties = await Property.find(filter)
            .populate("landlordId", "name email phone")
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for faster queries

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
        // Use findByIdAndUpdate for faster operation
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { 
                isVerified: true,
                status: "approved",
                $unset: { declineReason: "", declinedAt: "" } // Clear decline fields
            },
            { new: true, runValidators: false } // Skip validation for faster update
        ).lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Respond immediately
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

        if (!reason || reason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Decline reason is required",
            });
        }

        // Get property with landlord info
        const property = await Property.findById(req.params.id)
            .populate("landlordId", "name email")
            .lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Mark property as declined (keep in database so landlord can fix it)
        await Property.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: "declined",
                    isVerified: false,
                    isActive: false,
                    declineReason: reason,
                    declinedAt: new Date()
                }
            }
        );

        // Send response IMMEDIATELY
        res.status(200).json({
            success: true,
            message: "Property declined and landlord notified via email",
        });

        // Send decline notification email asynchronously AFTER response (fire-and-forget)
        if (property.landlordId && property.landlordId.email) {
            setTimeout(async () => {
                try {
                    await sendPropertyDeclineEmail(
                        property.landlordId.email,
                        property.landlordId.name,
                        property.title,
                        reason
                    );
                } catch (emailError) {
                    console.error("Error sending decline email:", emailError);
                }
            }, 0);
        }
    } catch (error) {
        console.error("Decline Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error declining property",
            error: error.message,
        });
    }
};

