import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import config from "../Config/env.config.js";


export const verifyToken = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided. Please login.",
            });
        }

        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired. Use refresh token to get a new one.",
                tokenExpired: true,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error verifying token",
            error: error.message,
        });
    }
};

export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${allowedRoles.join(", ")} can access this route.`,
            });
        }

        next();
    };
};

export const checkSubscription = async (req, res, next) => {
    try {
        if (req.user.role !== "landlord") {
            return next();
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const hasActiveSubscription = user.hasActiveSubscription();

        if (!hasActiveSubscription) {
            return res.status(403).json({
                success: false,
                message: "Subscription expired or inactive. Please renew your subscription.",
                requiresPayment: true,
            });
        }

        next();
    } catch (error) {
        console.error("Check Subscription Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error checking subscription",
            error: error.message,
        });
    }
};
