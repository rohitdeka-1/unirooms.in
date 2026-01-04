import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      unique: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    // Location with GeoJSON for geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      locality: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      pincode: {
        type: String,
        match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
      },
    },
    type: {
      type: String,
      enum: ["Engineering", "Medical", "Arts", "Commerce", "Science", "University", "Other"],
      default: "Other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
collegeSchema.index({ location: "2dsphere" });

// Text index for search functionality
collegeSchema.index({ name: "text", shortName: "text", "address.city": "text" });

const College = mongoose.model("College", collegeSchema);

export default College;
