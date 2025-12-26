import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet"],
    },
    purpose: {
      type: String,
      enum: ["registration", "subscription_renewal"],
      required: [true, "Payment purpose is required"],
    },
    // Cashfree specific fields
    cashfreeOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    cashfreePaymentId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    cashfreeSignature: {
      type: String,
    },
    // Additional transaction info
    transactionMessage: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    // Subscription validity (for registration payments)
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    // Refund info
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
    },
    refundDate: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ cashfreeOrderId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Method to mark payment as successful
paymentSchema.methods.markAsSuccess = async function (paymentData) {
  this.status = "success";
  this.cashfreePaymentId = paymentData.cashfreePaymentId;
  this.paymentMethod = paymentData.paymentMethod;
  this.paymentDate = new Date();
  this.transactionMessage = paymentData.message || "Payment successful";
  
  // Set subscription dates (6 months validity)
  if (this.purpose === "registration" || this.purpose === "subscription_renewal") {
    this.subscriptionStartDate = new Date();
    this.subscriptionEndDate = new Date();
    this.subscriptionEndDate.setMonth(this.subscriptionEndDate.getMonth() + 6);
  }
  
  return await this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = async function (reason) {
  this.status = "failed";
  this.failureReason = reason;
  return await this.save();
};

// Static method to get user's payment history
paymentSchema.statics.getUserPayments = async function (userId) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .populate("userId", "name email");
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
