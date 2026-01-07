import express from "express";
import {
  registerStudent,
  registerLandlord,
  login,
  googleSignup,
  googleLogin,
  getCurrentUser,
  updateProfile,
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
import { authLimiter, registrationLimiter } from "../Middlewares/security.middleware.js";

const authRoute = express.Router();

// Registration routes with rate limiting
authRoute.post("/register/student", registrationLimiter, validateRegistration, registerStudent);

authRoute.post("/register/landlord", registrationLimiter, validateRegistration, registerLandlord);

// Login route with strict rate limiting
authRoute.post("/login", authLimiter, validateLogin, login);






authRoute.post("/refresh-token", refreshAccessToken);






authRoute.post("/request-otp", requestLoginOTP);




authRoute.post("/verify-otp", verifyLoginOTP);






authRoute.post("/google/signup", validateGoogleSignup, googleSignup);




authRoute.post("/google/login", validateGoogleAuth, googleLogin);






authRoute.get("/verify-email/:token", verifyEmail);




authRoute.post("/resend-verification", resendVerificationEmail);






authRoute.post("/forgot-password", forgotPassword);




authRoute.post("/verify-reset-otp", verifyResetOTP);




authRoute.post("/reset-password", resetPassword);






authRoute.get("/me", verifyToken, getCurrentUser);




authRoute.put("/profile", verifyToken, updateProfile);




authRoute.post("/logout", verifyToken, logout);

export default authRoute;
