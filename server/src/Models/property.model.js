import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord ID is required"],
    },
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [500, "Price must be at least ₹500"],
      max: [100000, "Price cannot exceed ₹1,00,000"],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, "Security deposit cannot be negative"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords) {
            return coords.length === 2 &&
              coords[0] >= -180 && coords[0] <= 180 &&
              coords[1] >= -90 && coords[1] <= 90;
          },
          message: "Invalid coordinates format",
        },
      },
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      locality: {
        type: String,
        required: [true, "Locality is required"],
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
      },
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    campusName: {
      type: String,
      required: [true, "Campus name is required"],
      trim: true,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "shared"],
      required: [true, "Room type is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    totalRooms: {
      type: Number,
      required: [true, "Total rooms is required"],
      min: [1, "Must have at least 1 room"],
    },
    availableRooms: {
      type: Number,
      required: [true, "Available rooms is required"],
      min: [0, "Available rooms cannot be negative"],
    },
    amenities: {
      type: [String],
      enum: [
        "wifi",
        "ac",
        "parking",
        "laundry",
        "meals",
        "gym",
        "water",
        "electricity",
        "security",
        "cctv",
        "powerBackup",
        "attached_bathroom",
        "furnished",
        "semifurnished",
        "geyser",
        "fridge",
        "tv",
        "studyTable",
        "wardrobe",
        "balcony",
        "Washing Machine",
        "Mattress",
        "Geyser",
      ],
      default: [],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
      },
    ],
    coverImageIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    contactRequests: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    declineReason: {
      type: String,
      trim: true,
    },
    declinedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

propertySchema.index({ location: "2dsphere" });

propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ landlordId: 1, isActive: 1 });
propertySchema.index({ isActive: 1, isVerified: 1 });

// Text index for search functionality - includes campusName for college/campus searches
propertySchema.index({ title: "text", description: "text", city: "text", campusName: "text" });

propertySchema.virtual("hasAvailability").get(function () {
  return this.availableRooms > 0;
});

propertySchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

propertySchema.methods.incrementContactRequests = async function () {
  this.contactRequests += 1;
  return await this.save();
};

propertySchema.pre("save", async function () {
  if (this.availableRooms > this.totalRooms) {
    this.availableRooms = this.totalRooms;
  }
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
