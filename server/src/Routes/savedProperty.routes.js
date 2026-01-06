import express from "express";
import { protect } from "../Middlewares/auth.middleware.js";
import {
    saveProperty,
    unsaveProperty,
    getSavedProperties,
    checkIfSaved,
} from "../Controllers/savedProperty.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all saved properties
router.get("/", getSavedProperties);

// Check if property is saved
router.get("/check/:propertyId", checkIfSaved);

// Save a property
router.post("/:propertyId", saveProperty);

// Unsave a property
router.delete("/:propertyId", unsaveProperty);

export default router;
