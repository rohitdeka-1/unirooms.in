import express from "express";
import {
    createPaymentOrder,
    verifyPayment,
    getMyPayments,
    getPaymentById,
    handleWebhook,
} from "../Controllers/payment.controller.js";
import { protect, authorize } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// Webhook route (public - called by Cashfree)
router.post("/webhook", handleWebhook);

// Protected routes
router.post("/create-order", protect, authorize("landlord"), createPaymentOrder);
router.post("/verify", protect, authorize("landlord"), verifyPayment);
router.get("/my-payments", protect, getMyPayments);
router.get("/:id", protect, getPaymentById);

export default router;
