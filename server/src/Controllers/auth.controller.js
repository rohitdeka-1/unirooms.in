import User from "../Models/user.model.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import config from "../Config/env.config.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
    sendWelcomeEmail,
    sendLoginNotificationEmail,
    sendOTPEmail,
    sendVerificationEmail,
    sendPasswordResetOTP,
} from "../Services/email.service.js";
import {
    storeRefreshToken,
    deleteRefreshToken,
    verifyRefreshToken,
} from "../Services/redis.service.js";

const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const sendTokenResponse = async (user, statusCode, res, message, additionalData = {}) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await storeRefreshToken(user._id.toString(), refreshToken, 7 * 24 * 60 * 60);

    const cookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.status(statusCode).json({
        success: true,
        message,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionExpiry: user.subscriptionExpiry,
            },
            accessToken,
            refreshToken,
            ...additionalData,
        },
    });
};

// ============== MANUAL REGISTRATION ==============

// @desc    Register a new student
// @route   POST /api/auth/register/student
// @access  Public
export const registerStudent = async (req, res) => {
    try {
        // Validation check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            // If user exists but is not verified, allow re-registration
            if (!existingUser.isVerified && existingUser.email === email) {
                console.log("Re-registering unverified user:", email);
                
                // Update the user details
                existingUser.name = name;
                existingUser.phone = phone;
                existingUser.password = password;
                
                // Generate new verification token
                const verificationToken = existingUser.generateEmailVerificationToken();
                await existingUser.save();

                sendVerificationEmail(email, name, verificationToken)
                    .then(() => console.log("✅ Verification email sent to:", email))
                    .catch((err) => console.error("❌ Failed to send verification email to", email, ":", err.message));

                return res.status(201).json({
                    success: true,
                    message: "Registration successful! A new verification email has been sent. Please check your email.",
                    data: {
                        email: existingUser.email,
                        name: existingUser.name,
                        requiresEmailVerification: true,
                    }
                });
            }
            
            return res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? "Email already registered. Please login or use a different email."
                        : "Phone number already registered. Please use a different phone number.",
            });
        }
        
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: "student",
        });

        console.log("Student registered:", email);

        // Generate and send verification email
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        sendVerificationEmail(email, name, verificationToken)
            .then(() => console.log("✅ Verification email sent to:", email))
            .catch((err) => console.error("❌ Failed to send verification email to", email, ":", err.message));

        // Don't send tokens - user must verify email first
        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account before logging in.",
            data: {
                email: user.email,
                name: user.name,
                requiresEmailVerification: true,
            }
        });
    } catch (error) {
        console.error("Register Student Error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `This ${field} is already registered. Please use a different ${field}.`,
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error registering student. Please try again.",
            error: error.message,
        });
    }
};

// @desc    Register a new landlord
// @route   POST /api/auth/register/landlord
// @access  Public (but requires payment verification in production)
export const registerLandlord = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            // If user exists but is not verified, allow re-registration
            if (!existingUser.isVerified && existingUser.email === email) {
                console.log("Re-registering unverified landlord:", email);
                
                // Update the user details
                existingUser.name = name;
                existingUser.phone = phone;
                existingUser.password = password;
                existingUser.role = "landlord";
                existingUser.subscriptionStatus = "none";
                
                // Generate new verification token
                const verificationToken = existingUser.generateEmailVerificationToken();
                await existingUser.save();

                sendVerificationEmail(email, name, verificationToken)
                    .then(() => console.log("✅ Verification email sent to:", email))
                    .catch((err) => console.error("❌ Failed to send verification email to", email, ":", err.message));

                return res.status(201).json({
                    success: true,
                    message: "Registration successful! A new verification email has been sent. Please check your email.",
                    data: {
                        email: existingUser.email,
                        name: existingUser.name,
                        role: existingUser.role,
                        requiresEmailVerification: true,
                        requiresPayment: true,
                    }
                });
            }
            
            return res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? "Email already registered. Please login or use a different email."
                        : "Phone number already registered. Please use a different phone number.",
            });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: "landlord",
            subscriptionStatus: "none",
        });

        console.log("Landlord registered:", email);

        // Generate and send verification email
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        sendVerificationEmail(email, name, verificationToken)
            .then(() => console.log("✅ Verification email sent to:", email))
            .catch((err) => console.error("❌ Failed to send verification email to", email, ":", err.message));

        // Don't send tokens - user must verify email first
        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account before logging in.",
            data: {
                email: user.email,
                name: user.name,
                role: user.role,
                requiresEmailVerification: true,
                requiresPayment: true,
            }
        });
    } catch (error) {
        console.error("Register Landlord Error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `This ${field} is already registered. Please use a different ${field}.`,
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error registering landlord. Please try again.",
            error: error.message,
        });
    }
};

// ============== MANUAL LOGIN ==============

// @desc    Login user (student or landlord)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support.",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email address before logging in. Check your inbox for the verification link.",
                requiresEmailVerification: true,
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        user.password = undefined;

        const loginInfo = {
            device: req.headers["user-agent"] || "Unknown Device",
            ip: req.ip || req.connection.remoteAddress || "Unknown IP",
            location: "India",
        };

        // Send login notification (don't wait for it)
        sendLoginNotificationEmail(user.email, user.name, loginInfo)
            .then(() => console.log("✅ Login notification sent to:", user.email))
            .catch((err) => console.error("❌ Failed to send login notification to", user.email, ":", err.message));
        
        sendTokenResponse(user, 200, res, "Login successful");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message,
        });
    }
};

// ============== GOOGLE AUTH ==============

// @desc    Google Sign Up (Register with Google)
// @route   POST /api/auth/google/signup
// @access  Public
export const googleSignup = async (req, res) => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        if (!role || !["student", "landlord"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Valid role (student/landlord) is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please use login instead.",
            });
        }

        const user = await User.create({
            name,
            email,
            phone: undefined, // No phone number for Google OAuth users
            password: `GOOGLE_AUTH_${googleId}_${Date.now()}`,
            role,
            profileImage: picture || undefined,
            isVerified: true,
            subscriptionStatus: role === "landlord" ? "none" : undefined,
        });

        // Send welcome email for Google signup
        sendWelcomeEmail(user.email, user.name, user.role)
            .then(() => console.log("✅ Welcome email sent to:", user.email))
            .catch((err) => console.error("❌ Failed to send welcome email to", user.email, ":", err.message));

        sendTokenResponse(
            user,
            201,
            res,
            `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully with Google`,
            {
                requiresPayment: role === "landlord",
                requiresPhoneUpdate: true,
            }
        );
    } catch (error) {
        console.error("Google Signup Error:", error);
        res.status(500).json({
            success: false,
            message: "Error signing up with Google",
            error: error.message,
        });
    }
};

// @desc    Google Login (Login with Google)
// @route   POST /api/auth/google/login
// @access  Public
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, picture } = payload;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account not found. Please sign up first.",
                requiresSignup: true,
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support.",
            });
        }

        // Update profile image if it has changed
        if (picture && user.profileImage !== picture) {
            user.profileImage = picture;
            await user.save();
        }

        // Send login notification email for Google login
        const loginInfo = {
            device: req.headers["user-agent"] || "Unknown Device",
            ip: req.ip || req.connection.remoteAddress || "Unknown IP",
            location: "India",
        };

        sendLoginNotificationEmail(user.email, user.name, loginInfo)
            .then(() => console.log("✅ Login notification sent to:", user.email))
            .catch((err) => console.error("❌ Failed to send login notification to", user.email, ":", err.message));

        sendTokenResponse(user, 200, res, "Login successful");
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in with Google",
            error: error.message,
        });
    }
};

// ============== TOKEN MANAGEMENT ==============

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Base user data common to all roles
        const baseUserData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // Role-specific profile data
        let profileData;

        if (user.role === "landlord") {
            // Landlord-specific profile with subscription details
            profileData = {
                ...baseUserData,
                subscription: {
                    status: user.subscriptionStatus,
                    expiryDate: user.subscriptionExpiry,
                    isActive: user.hasActiveSubscription(),
                    daysRemaining: user.subscriptionExpiry
                        ? Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24))
                        : null,
                },
                // Can add landlord-specific fields here in future
                // propertyCount, ratings, etc.
            };
        } else if (user.role === "student") {
            // Student-specific profile
            profileData = {
                ...baseUserData,
                // Can add student-specific fields here in future
                // savedProperties, preferences, etc.
            };
        } else {
            // Admin or other roles
            profileData = baseUserData;
        }

        res.status(200).json({
            success: true,
            data: {
                user: profileData,
            },
        });
    } catch (error) {
        console.error("Get Current User Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user data",
            error: error.message,
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, college } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) {
            // Check if phone is already taken by another user
            const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number already in use",
                });
            }
            user.phone = phone;
        }
        if (college !== undefined) user.college = college;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    college: user.college,
                    role: user.role,
                    profileImage: user.profileImage,
                },
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        const userId = req.user.id;

        await deleteRefreshToken(userId);

        res.cookie("accessToken", "none", {
            expires: new Date(Date.now() + 10 * 1000), // 10 seconds
            httpOnly: true,
        });

        res.cookie("refreshToken", "none", {
            expires: new Date(Date.now() + 10 * 1000), // 10 seconds
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully. Please clear localStorage on frontend.",
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message,
        });
    }
};

// ============== OTP LOGIN ==============

// @desc    Request OTP for login
// @route   POST /api/auth/request-otp
// @access  Public
export const requestLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support.",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const bcrypt = await import("bcryptjs");
        const hashedOTP = await bcrypt.default.hash(otp, 10);

        user.loginOTP = hashedOTP;
        user.loginOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        await sendOTPEmail(email, user.name, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Valid for 10 minutes.",
            data: {
                email: email,
                expiresIn: "10 minutes",
            },
        });
    } catch (error) {
        console.error("Request OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending OTP. Please try again.",
            error: error.message,
        });
    }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email }).select("+loginOTP +loginOTPExpire");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.loginOTP || !user.loginOTPExpire) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please request a new OTP.",
            });
        }

        if (user.loginOTPExpire < new Date()) {
            user.loginOTP = undefined;
            user.loginOTPExpire = undefined;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP.",
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email address before logging in. Check your inbox for the verification link.",
                requiresEmailVerification: true,
            });
        }

        const bcrypt = await import("bcryptjs");
        const isOTPValid = await bcrypt.default.compare(otp, user.loginOTP);

        if (!isOTPValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        user.loginOTP = undefined;
        user.loginOTPExpire = undefined;
        await user.save();

        const loginInfo = {
            device: req.headers["user-agent"] || "Unknown Device",
            ip: req.ip || req.connection.remoteAddress || "Unknown IP",
            location: "India",
        };

        sendLoginNotificationEmail(user.email, user.name, loginInfo).catch((err) =>
            console.error("Failed to send login notification:", err)
        );

        sendTokenResponse(user, 200, res, "Login successful with OTP");
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying OTP",
            error: error.message,
        });
    }
};

// ============== REFRESH TOKEN ==============

// @desc    Refresh access token using refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (requires valid refresh token)
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not provided",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const isValidToken = await verifyRefreshToken(decoded.id, refreshToken);
        if (!isValidToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked. Please login again.",
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const newAccessToken = user.generateAccessToken();

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: newAccessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({
            success: false,
            message: "Error refreshing token",
            error: error.message,
        });
    }
};

// ============== EMAIL VERIFICATION ==============

// @desc    Verify email with token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required",
            });
        }

        console.log("Verifying token:", token.substring(0, 10) + "...");

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        console.log("Hashed token:", hashedToken.substring(0, 10) + "...");

        // First check if user exists with this token (regardless of expiry)
        const userWithToken = await User.findOne({
            emailVerificationToken: hashedToken,
        });

        if (!userWithToken) {
            console.log("No user found with this token");
            return res.status(400).json({
                success: false,
                message: "Invalid verification token. The link may be incorrect or the account may have been deleted.",
            });
        }

        // Check if already verified
        if (userWithToken.isVerified) {
            console.log("User already verified:", userWithToken.email);
            return res.status(200).json({
                success: true,
                message: "Email already verified! You can now login to your account.",
                data: {
                    isVerified: true,
                    alreadyVerified: true,
                },
            });
        }

        // Check if token is expired
        if (userWithToken.emailVerificationExpire && userWithToken.emailVerificationExpire < Date.now()) {
            console.log("Token expired for:", userWithToken.email);
            return res.status(400).json({
                success: false,
                message: "Verification token has expired. Please request a new verification email.",
                data: {
                    email: userWithToken.email,
                    expired: true,
                },
            });
        }

        // Mark user as verified
        userWithToken.isVerified = true;
        userWithToken.emailVerificationToken = undefined;
        userWithToken.emailVerificationExpire = undefined;
        await userWithToken.save();

        console.log("Email verified successfully for:", userWithToken.email);

        // Send welcome email now that user is verified
        sendWelcomeEmail(userWithToken.email, userWithToken.name, userWithToken.role).catch((err) =>
            console.error("Failed to send welcome email:", err)
        );

        // Auto-login: Generate and send tokens for first-time verification
        userWithToken.password = undefined; // Remove password from response
        sendTokenResponse(userWithToken, 200, res, "Email verified successfully! Welcome to Unirooms.");
    } catch (error) {
        console.error("Verify Email Error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying email. Please try again or contact support.",
            error: error.message,
        });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified. You can login now.",
            });
        }

        // Generate new verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        await sendVerificationEmail(email, user.name, verificationToken);

        res.status(200).json({
            success: true,
            message: "Verification email sent successfully. Please check your inbox.",
            data: {
                email: email,
                expiresIn: "24 hours",
            },
        });
    } catch (error) {
        console.error("Resend Verification Error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending verification email",
            error: error.message,
        });
    }
};

// ============== FORGOT PASSWORD ==============

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support.",
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        const hashedOTP = await bcrypt.hash(otp, 10);

        user.resetPasswordOTP = hashedOTP;
        user.resetPasswordOTPExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        // Send OTP via email
        await sendPasswordResetOTP(email, user.name, otp);

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email. Valid for 15 minutes.",
            data: {
                email: email,
                expiresIn: "15 minutes",
            },
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending password reset OTP. Please try again.",
            error: error.message,
        });
    }
};

// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
export const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email }).select("+resetPasswordOTP +resetPasswordOTPExpire");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpire) {
            return res.status(400).json({
                success: false,
                message: "No password reset request found. Please request a new OTP.",
            });
        }

        // Check if OTP has expired
        if (user.resetPasswordOTPExpire < new Date()) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new password reset.",
            });
        }

        // Verify OTP
        const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);

        if (!isOTPValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        // OTP is valid - keep it for password reset but mark verification
        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
            data: {
                otpVerified: true,
                email: email,
            },
        });
    } catch (error) {
        console.error("Verify Reset OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying OTP",
            error: error.message,
        });
    }
};

// @desc    Reset password with new password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Validation
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, new password, and confirm password are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        const user = await User.findOne({ email }).select("+resetPasswordOTP +resetPasswordOTPExpire +password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpire) {
            return res.status(400).json({
                success: false,
                message: "No password reset request found. Please request a new OTP.",
            });
        }

        // Check if OTP has expired
        if (user.resetPasswordOTPExpire < new Date()) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new password reset.",
            });
        }

        // Verify OTP one final time
        const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);

        if (!isOTPValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with your new password.",
            data: {
                passwordReset: true,
            },
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: error.message,
        });
    }
};
