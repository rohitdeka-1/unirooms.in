import mongoose from "mongoose";

const savedPropertySchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student ID is required"],
        },
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: [true, "Property ID is required"],
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [200, "Notes cannot exceed 200 characters"],
        },
    },
    {
        timestamps: true,
    }
);

savedPropertySchema.index({ studentId: 1, propertyId: 1 }, { unique: true });

savedPropertySchema.index({ studentId: 1, createdAt: -1 });

savedPropertySchema.statics.isSaved = async function (studentId, propertyId) {
    const saved = await this.findOne({ studentId, propertyId });
    return !!saved;
};

savedPropertySchema.statics.getStudentSavedProperties = async function (
    studentId,
    options = {}
) {
    const { page = 1, limit = 10 } = options;

    return await this.find({ studentId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
            path: "propertyId",
            select: "title price city images roomType availableRooms averageRating",
            match: { isActive: true },
        });
};

savedPropertySchema.statics.getSavedCount = async function (studentId) {
    return await this.countDocuments({ studentId });
};

const SavedProperty = mongoose.model("SavedProperty", savedPropertySchema);

export default SavedProperty;
