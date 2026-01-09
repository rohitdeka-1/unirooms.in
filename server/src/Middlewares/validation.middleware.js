import { body } from "express-validator";

export const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Please enter your full name.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters long."),
  
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Please provide your email address.")
    .isEmail()
    .withMessage("Invalid email format. Please provide a valid email address (e.g., user@example.com).")
    .normalizeEmail(),
  
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required. Please provide your 10-digit mobile number.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number. Please provide a valid 10-digit Indian phone number starting with 6, 7, 8, or 9."),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required. Please create a strong password.")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain: at least one uppercase letter (A-Z), one lowercase letter (a-z), and one number (0-9).")
    .custom((value) => {
      if (value.length < 8) {
        throw new Error("For better security, we recommend using a password with at least 8 characters.");
      }
      return true;
    })
    .optional(),
];

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Please enter your registered email address.")
    .isEmail()
    .withMessage("Invalid email format. Please provide a valid email address.")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required. Please enter your password."),
];

export const validateGoogleAuth = [
  body("credential")
    .notEmpty()
    .withMessage("Google authentication failed. Please try again or use email signup."),
];

export const validateGoogleSignup = [
  body("credential")
    .notEmpty()
    .withMessage("Google authentication failed. Please try again or use email signup."),
  
  body("role")
    .notEmpty()
    .withMessage("Please select your account type (Student or Landlord).")
    .isIn(["student", "landlord"])
    .withMessage("Invalid account type. Please select either Student or Landlord."),
];
