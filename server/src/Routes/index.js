import express from "express";
import authRoute from "./auth.routes.js";
import propertyRoute from "./property.routes.js";
import paymentRoute from "./payment.routes.js";
import savedPropertyRoute from "./savedProperty.routes.js";
import testRoute from "./test.routes.js";
import config from "../Config/env.config.js";

const router = express.Router();

// Mount all routes
router.use("/auth", authRoute);
router.use("/properties", propertyRoute);
router.use("/payments", paymentRoute);
router.use("/saved", savedPropertyRoute);

// Test routes (only in development)
if (config.NODE_ENV !== "production") {
    router.use("/test", testRoute);
}

// Add more routes here as you create them:
// router.use("/reviews", reviewRoute);

export default router;
