import express from "express";
import mongoose from "mongoose";
import { sendOTPEmail, sendVerificationEmail, sendLoginNotificationEmail } from "../Services/email.service.js";

const router = express.Router();

// @desc    Test email sending (development only)
// @route   POST /api/test/send-email
// @access  Public (should be disabled in production)
router.post("/send-email", async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        let result;
        
        switch (type) {
            case "verification":
                result = await sendVerificationEmail(email, "Test User", "test-token-12345");
                break;
            case "login":
                result = await sendLoginNotificationEmail(email, "Test User", {
                    device: "Test Device",
                    ip: "127.0.0.1",
                    location: "Test Location"
                });
                break;
            case "otp":
                result = await sendOTPEmail(email, "Test User", "123456");
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid email type. Use: verification, login, or otp",
                });
        }

        res.status(200).json({
            success: true,
            message: `${type} email sent successfully`,
            data: result,
        });
    } catch (error) {
        console.error("Test email error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});

// @desc    Fix phone index for Google OAuth (run once in production)
// @route   GET /api/test/fix-phone-index
// @access  Public (remove after running once)
router.get("/fix-phone-index", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const usersCollection = db.collection("users");
        
        // Get current indexes
        const existingIndexes = await usersCollection.indexes();
        const phoneIndex = existingIndexes.find(idx => idx.key.phone === 1);
        
        let message = "";
        
        if (phoneIndex && !phoneIndex.sparse) {
            // Drop old non-sparse index
            await usersCollection.dropIndex("phone_1");
            message += "Dropped old non-sparse phone index. ";
        }
        
        if (!phoneIndex || !phoneIndex.sparse) {
            // Create sparse index
            await usersCollection.createIndex(
                { phone: 1 }, 
                { unique: true, sparse: true, name: "phone_1" }
            );
            message += "Created new sparse unique index. ";
        } else {
            message = "Phone index is already sparse - no action needed.";
        }
        
        // Get updated indexes
        const updatedIndexes = await usersCollection.indexes();
        
        res.json({ 
            success: true, 
            message,
            indexes: updatedIndexes.map(idx => ({
                name: idx.name,
                key: idx.key,
                sparse: idx.sparse || false,
                unique: idx.unique || false
            }))
        });
    } catch (error) {
        console.error("Error fixing phone index:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

export default router;
