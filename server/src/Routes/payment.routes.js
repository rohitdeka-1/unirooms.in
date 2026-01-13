import express from "express";
import {
    createPaymentOrder,
    verifyPayment,
    getMyPayments,
    getPaymentById,
    handleWebhook,
    createDonation,
    verifyDonation,
} from "../Controllers/payment.controller.js";
import { protect, authorize } from "../Middlewares/auth.middleware.js";
import { paymentLimiter } from "../Middlewares/security.middleware.js";

const router = express.Router();

// Webhook endpoint (no auth required)
router.post("/webhook", handleWebhook);

// Donation routes (public - no auth required)
router.post("/donate", paymentLimiter, createDonation);
router.post("/donate/verify", verifyDonation);

// Protected payment routes with rate limiting
router.post("/create-order", protect, authorize("landlord"), paymentLimiter, createPaymentOrder);
router.post("/verify", protect, authorize("landlord"), verifyPayment);
router.get("/my-payments", protect, getMyPayments);
router.get("/:id", protect, getPaymentById);

export default router;
