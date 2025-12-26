import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../Config/env.config.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email service connection failed:", error.message);
  } else {
    console.log(chalk.magenta("Email service is ready to send emails"));
  }
});

const compileTemplate = (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    "../Emails/templates",
    `${templateName}.hbs`
  );

  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);
  return template(data);
};

export const sendOTPEmail = async (email, name, otp) => {
  try {
    const html = compileTemplate("otp", {
      name,
      otp,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP - PG Finder",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Send Email Verification
export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const verificationUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;

    const html = compileTemplate("emailVerification", {
      name,
      verificationUrl,
      expiryTime: "24 hours",
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - PG Finder",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name, role) => {
  try {
    const html = compileTemplate("welcome", {
      name,
      role,
      dashboardUrl: `${config.FRONTEND_URL}/dashboard`,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: `Welcome to PG Finder, ${name}!`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

// Send Login Notification Email
export const sendLoginNotificationEmail = async (email, name, loginInfo) => {
  try {
    const html = compileTemplate("loginNotification", {
      name,
      loginTime: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      }),
      device: loginInfo.device || "Unknown Device",
      location: loginInfo.location || "Unknown Location",
      ipAddress: loginInfo.ip || "Unknown IP",
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: "New Login to Your Account - PG Finder",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Login notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending login notification:", error);
    // Don't throw error for login notification (non-critical)
    return { success: false, error: error.message };
  }
};

// Send Password Reset OTP Email
export const sendPasswordResetOTP = async (email, name, otp) => {
  try {
    const html = compileTemplate("passwordResetOTP", {
      name,
      otp,
      expiryTime: "15 minutes",
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - PG Finder",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset OTP email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
    throw error;
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = compileTemplate("passwordReset", {
      name,
      resetUrl,
      expiryTime: "15 minutes",
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - PG Finder",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export default {
  sendOTPEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetOTP,
  sendPasswordResetEmail,
};
