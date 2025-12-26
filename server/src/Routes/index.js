import express from "express";
import authRoute from "./auth.routes.js";

const router = express.Router();

// Mount all routes
router.use("/auth", authRoute);

// Add more routes here as you create them:
// router.use("/properties", propertyRoute);
// router.use("/payments", paymentRoute);
// router.use("/reviews", reviewRoute);
// router.use("/saved", savedPropertyRoute);

export default router;
