import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../Config/env.config.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian phone number"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["student", "landlord", "admin"],
            default: "student",
            required: true,
        },
        profileImage: {
            type: String,
            default: "https://res.cloudinary.com/default-avatar.png",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Landlord-specific fields
        subscriptionStatus: {
            type: String,
            enum: ["none", "active", "expired"],
            default: "none",
        },
        subscriptionExpiry: {
            type: Date,
            default: null,
        },
        loginOTP: {
            type: String,
            select: false,
        },
        loginOTPExpire: {
            type: Date,
            select: false,
        },
        resetPasswordOTP: {
            type: String,
            select: false,
        },
        resetPasswordOTPExpire: {
            type: Date,
            select: false,
        },
        emailVerificationToken: String,
        emailVerificationExpire: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
            email: this.email
        },
        config.JWT_ACCESS_SECRET,
        {
            expiresIn: config.JWT_ACCESS_EXPIRE,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        config.JWT_REFRESH_SECRET,
        {
            expiresIn: config.JWT_REFRESH_EXPIRE,
        }
    );
};

userSchema.methods.generateEmailVerificationToken = function () {
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return verificationToken;
};

userSchema.methods.hasActiveSubscription = function () {
    if (this.role !== "landlord") return true;
    return (
        this.subscriptionStatus === "active" &&
        this.subscriptionExpiry &&
        this.subscriptionExpiry > new Date()
    );
};

userSchema.virtual("displayName").get(function () {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
});

const User = mongoose.model("User", userSchema);

export default User;
