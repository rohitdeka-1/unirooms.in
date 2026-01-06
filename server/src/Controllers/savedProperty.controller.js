import SavedProperty from "../Models/savedProperty.model.js";
import Property from "../Models/property.model.js";

// @desc    Save a property
// @route   POST /api/saved/:propertyId
// @access  Private (Student)
export const saveProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const studentId = req.user.id;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Check if already saved
        const existingSave = await SavedProperty.findOne({ studentId, propertyId });
        if (existingSave) {
            return res.status(400).json({
                success: false,
                message: "Property already saved",
            });
        }

        // Save property
        const savedProperty = await SavedProperty.create({
            studentId,
            propertyId,
        });

        res.status(201).json({
            success: true,
            message: "Property saved successfully",
            data: savedProperty,
        });
    } catch (error) {
        console.error("Save Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error saving property",
            error: error.message,
        });
    }
};

// @desc    Unsave a property
// @route   DELETE /api/saved/:propertyId
// @access  Private (Student)
export const unsaveProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const studentId = req.user.id;

        const savedProperty = await SavedProperty.findOneAndDelete({
            studentId,
            propertyId,
        });

        if (!savedProperty) {
            return res.status(404).json({
                success: false,
                message: "Saved property not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Property removed from saved list",
        });
    } catch (error) {
        console.error("Unsave Property Error:", error);
        res.status(500).json({
            success: false,
            message: "Error removing property from saved list",
            error: error.message,
        });
    }
};

// @desc    Get all saved properties for logged in student
// @route   GET /api/saved
// @access  Private (Student)
export const getSavedProperties = async (req, res) => {
    try {
        const studentId = req.user.id;

        const savedProperties = await SavedProperty.find({ studentId })
            .sort({ createdAt: -1 })
            .populate({
                path: "propertyId",
                match: { isActive: true, isVerified: true },
                populate: {
                    path: "landlord",
                    select: "name phone email",
                },
            });

        // Filter out any null properties (deleted or inactive)
        const validSavedProperties = savedProperties
            .filter((sp) => sp.propertyId)
            .map((sp) => ({
                ...sp.propertyId.toObject(),
                savedAt: sp.createdAt,
                savedId: sp._id,
            }));

        res.status(200).json({
            success: true,
            count: validSavedProperties.length,
            data: validSavedProperties,
        });
    } catch (error) {
        console.error("Get Saved Properties Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching saved properties",
            error: error.message,
        });
    }
};

// @desc    Check if a property is saved
// @route   GET /api/saved/check/:propertyId
// @access  Private (Student)
export const checkIfSaved = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const studentId = req.user.id;

        const isSaved = await SavedProperty.exists({ studentId, propertyId });

        res.status(200).json({
            success: true,
            isSaved: !!isSaved,
        });
    } catch (error) {
        console.error("Check Saved Error:", error);
        res.status(500).json({
            success: false,
            message: "Error checking saved status",
            error: error.message,
        });
    }
};
