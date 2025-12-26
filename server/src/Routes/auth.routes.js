import express from "express";
import {
  registerStudent,
  registerLandlord,
  login,
  googleSignup,
  googleLogin,
  getCurrentUser,
  logout,
  requestLoginOTP,
  verifyLoginOTP,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../Controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validateGoogleSignup,
} from "../Middlewares/validation.middleware.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const authRoute = express.Router();

// ============== MANUAL AUTH ROUTES ==============

// @route   POST /api/v1/auth/register/student
// @desc    Register a new student with email & password
// @access  Public
authRoute.post("/register/student", validateRegistration, registerStudent);

// @route   POST /api/v1/auth/register/landlord
// @desc    Register a new landlord with email & password
// @access  Public
authRoute.post("/register/landlord", validateRegistration, registerLandlord);

// @route   POST /api/v1/auth/login
// @desc    Login with email & password (for both student and landlord)
// @access  Public
authRoute.post("/login", validateLogin, login);

// ============== TOKEN MANAGEMENT ==============

// @route   POST /api/v1/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public (requires valid refresh token)
authRoute.post("/refresh-token", refreshAccessToken);

// ============== OTP LOGIN ROUTES ==============

// @route   POST /api/v1/auth/request-otp
// @desc    Request OTP for login
// @access  Public
authRoute.post("/request-otp", requestLoginOTP);

// @route   POST /api/v1/auth/verify-otp
// @desc    Verify OTP and login
// @access  Public
authRoute.post("/verify-otp", verifyLoginOTP);

// ============== GOOGLE AUTH ROUTES ==============

// @route   POST /api/v1/auth/google/signup
// @desc    Sign up with Google (requires role selection)
// @access  Public
authRoute.post("/google/signup", validateGoogleSignup, googleSignup);

// @route   POST /api/v1/auth/google/login
// @desc    Login with Google (checks if user exists first)
// @access  Public
authRoute.post("/google/login", validateGoogleAuth, googleLogin);

// ============== EMAIL VERIFICATION ROUTES ==============

// @route   GET /api/v1/auth/verify-email/:token
// @desc    Verify email with token
// @access  Public
authRoute.get("/verify-email/:token", verifyEmail);

// @route   POST /api/v1/auth/resend-verification
// @desc    Resend verification email
// @access  Public
authRoute.post("/resend-verification", resendVerificationEmail);

// ============== PASSWORD RESET ROUTES ==============

// @route   POST /api/v1/auth/forgot-password
// @desc    Request password reset OTP
// @access  Public
authRoute.post("/forgot-password", forgotPassword);

// @route   POST /api/v1/auth/verify-reset-otp
// @desc    Verify password reset OTP
// @access  Public
authRoute.post("/verify-reset-otp", verifyResetOTP);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password with new password
// @access  Public
authRoute.post("/reset-password", resetPassword);

// ============== PROTECTED ROUTES ==============

// @route   GET /api/v1/auth/me
// @desc    Get current logged in user
// @access  Private
authRoute.get("/me", verifyToken, getCurrentUser);

// @route   POST /api/v1/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
authRoute.post("/logout", verifyToken, logout);

export default authRoute;
