import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function() {
        return this.purpose !== "donation";
      },
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
      enum: ["upi", "card", "netbanking", "wallet", "credit_card", "debit_card", "net_banking", "online"],
    },
    purpose: {
      type: String,
      enum: ["registration", "subscription_renewal", "property_listing", "donation"],
      required: [true, "Payment purpose is required"],
    },
    donorName: {
      type: String,
      default: "Anonymous",
    },
    donorMessage: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    propertiesCount: {
      type: Number,
      default: 1,
      min: [1, "Properties count must be at least 1"],
      required: function() {
        return this.purpose === "property_listing";
      }
    },
    
    cashfreeOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    cashfreePaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    cashfreeSignature: {
      type: String,
    },
    transactionMessage: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
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

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

paymentSchema.methods.markAsSuccess = async function (paymentData) {
  this.status = "success";
  this.cashfreePaymentId = paymentData.cashfreePaymentId;
  this.paymentMethod = paymentData.paymentMethod;
  this.paymentDate = new Date();
  this.transactionMessage = paymentData.message || "Payment successful";
  
  if (this.purpose === "registration" || this.purpose === "subscription_renewal") {
    this.subscriptionStartDate = new Date();
    this.subscriptionEndDate = new Date();
    this.subscriptionEndDate.setMonth(this.subscriptionEndDate.getMonth() + 6);
  }
  
  return await this.save();
};

paymentSchema.methods.markAsFailed = async function (reason) {
  this.status = "failed";
  this.failureReason = reason;
  return await this.save();
};

paymentSchema.statics.getUserPayments = async function (userId) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .populate("userId", "name email");
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
