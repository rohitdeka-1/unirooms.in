import express from "express";
import authRoute from "./auth.routes.js";
import propertyRoute from "./property.routes.js";
import paymentRoute from "./payment.routes.js";

const router = express.Router();

// Mount all routes
router.use("/auth", authRoute);
router.use("/properties", propertyRoute);
router.use("/payments", paymentRoute);

// Add more routes here as you create them:
// router.use("/reviews", reviewRoute);
// router.use("/saved", savedPropertyRoute);

export default router;
