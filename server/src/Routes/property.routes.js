import express from "express";
import {
    getAllProperties,
    getPropertyById,
    getLandlordProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    getLandlordStats,
    searchCollegesAPI,
    getPropertiesNearCollege,
    getAllCampuses,
    getAllPropertiesAdmin,
    approveProperty,
    declineProperty,
} from "../Controllers/property.controller.js";
import { protect, authorize, optionalAuth } from "../Middlewares/auth.middleware.js";
import { isAdmin } from "../Middlewares/admin.middleware.js";
import upload, { compressImages } from "../Middlewares/upload.middleware.js";
import { body } from "express-validator";

const router = express.Router();


const parseFormData = (req, res, next) => {
    if (req.body.location && typeof req.body.location === 'string') {
        try {
            req.body.location = JSON.parse(req.body.location);
        } catch (e) {
            console.error('Error parsing location:', e);
        }
    }
    if (req.body.address && typeof req.body.address === 'string') {
        try {
            req.body.address = JSON.parse(req.body.address);
        } catch (e) {
            console.error('Error parsing address:', e);
        }
    }
    if (req.body.existingImages && typeof req.body.existingImages === 'string') {
        try {
            req.body.existingImages = JSON.parse(req.body.existingImages);
        } catch (e) {
            console.error('Error parsing existingImages:', e);
            req.body.existingImages = null;
        }
    }
    if (req.body['amenities[]']) {
        req.body.amenities = Array.isArray(req.body['amenities[]']) 
            ? req.body['amenities[]'] 
            : [req.body['amenities[]']];
        delete req.body['amenities[]'];
    }
    next();
};


const propertyValidation = [
    body("title")
        .trim()
        .isLength({ min: 10, max: 100 })
        .withMessage("Title must be between 10 and 100 characters"),
    body("description")
        .trim()
        .isLength({ min: 20, max: 1000 })
        .withMessage("Description must be between 20 and 1000 characters"),
    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .isFloat({ min: 500, max: 100000 })
        .withMessage("Price must be between ₹500 and ₹1,00,000"),
    body("location.coordinates")
        .isArray({ min: 2, max: 2 })
        .withMessage("Coordinates must be an array of [longitude, latitude]"),
    body("address.street")
        .trim()
        .notEmpty()
        .withMessage("Street address is required"),
    body("address.locality")
        .trim()
        .notEmpty()
        .withMessage("Locality is required"),
    body("address.pincode")
        .matches(/^\d{6}$/)
        .withMessage("Valid 6-digit pincode is required"),
    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),
    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),
    body("roomType")
        .isIn(["single", "double", "triple", "shared"])
        .withMessage("Invalid room type"),
    body("totalRooms")
        .isInt({ min: 1 })
        .withMessage("Total rooms must be at least 1"),
    body("availableRooms")
        .isInt({ min: 0 })
        .withMessage("Available rooms cannot be negative"),
];


router.get("/", getAllProperties);
router.get("/campuses", getAllCampuses);
router.get("/colleges/search", searchCollegesAPI);
router.get("/near-college", getPropertiesNearCollege);
router.get("/:id", optionalAuth, getPropertyById); 


router.get("/landlord/my-properties", protect, authorize("landlord"), getLandlordProperties);
router.get("/landlord/stats", protect, authorize("landlord"), getLandlordStats);

router.get("/admin/all", protect, isAdmin, getAllPropertiesAdmin);
router.put("/admin/:id/approve", protect, isAdmin, approveProperty);
router.put("/admin/:id/decline", protect, isAdmin, declineProperty);

router.post("/", protect, authorize("landlord"), upload.array('images', 5), compressImages, parseFormData, propertyValidation, createProperty);
router.put("/:id", protect, authorize("landlord"), upload.array('images', 5), parseFormData, updateProperty);
router.delete("/:id", protect, authorize("landlord"), deleteProperty);
router.patch("/:id/toggle-active", protect, authorize("landlord"), togglePropertyStatus);

export default router;
