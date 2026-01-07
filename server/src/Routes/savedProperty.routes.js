import express from "express";
import { protect } from "../Middlewares/auth.middleware.js";
import {
    saveProperty,
    unsaveProperty,
    getSavedProperties,
    checkIfSaved,
} from "../Controllers/savedProperty.controller.js";

const router = express.Router();


router.use(protect);


router.get("/", getSavedProperties);


router.get("/check/:propertyId", checkIfSaved);


router.post("/:propertyId", saveProperty);


router.delete("/:propertyId", unsaveProperty);

export default router;
