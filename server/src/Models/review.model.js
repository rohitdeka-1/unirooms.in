import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
    },
    location: {
      type: Number,
      min: 1,
      max: 5,
    },
    facilities: {
      type: Number,
      min: 1,
      max: 5,
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
    },
    landlordResponse: {
      type: String,
      trim: true,
      maxlength: [300, "Response cannot exceed 300 characters"],
    },
    responseDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHelpful: {
      type: Number,
      default: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ studentId: 1, propertyId: 1 }, { unique: true });

reviewSchema.index({ propertyId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

reviewSchema.statics.calculateAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: { propertyId: mongoose.Types.ObjectId(propertyId) },
    },
    {
      $group: {
        _id: "$propertyId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Property").findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await mongoose.model("Property").findByIdAndUpdate(propertyId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.propertyId);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.propertyId);
});

reviewSchema.methods.addResponse = async function (response) {
  this.landlordResponse = response;
  this.responseDate = new Date();
  return await this.save();
};

reviewSchema.methods.markHelpful = async function () {
  this.isHelpful += 1;
  return await this.save();
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
