import express from "express";
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

export default router;
