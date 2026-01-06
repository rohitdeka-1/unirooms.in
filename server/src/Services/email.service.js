import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../Config/env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Handlebars helpers
handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service connection failed:", error.message);
  } else {
    console.log("✅ Email service is ready to send emails");
    console.log(`📧 Sending from: ${config.GMAIL_USER}`);
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
      subject: "Your Login OTP - UniRooms",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
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
      subject: "Verify Your Email - UniRooms",
      html,
    };

    console.log(`Sending verification email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email to", email, ":", error.message);
    if (error.code) console.error("Error code:", error.code);
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
      subject: `Welcome to UniRooms, ${name}!`,
      html,
    };

    console.log(`Sending welcome email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Error sending welcome email to", email, ":", error.message);
    if (error.code) console.error("Error code:", error.code);
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
      subject: "New Login to Your Account - UniRooms",
      html,
    };

    console.log(`Sending login notification to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Login notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Error sending login notification to", email, ":", error.message);
    if (error.code) console.error("Error code:", error.code);
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
      subject: "Password Reset OTP - UniRooms",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent:", info.messageId);
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
      subject: "Password Reset Request - UniRooms",
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

// Send Admin Notification for New Property
export const sendNewPropertyNotification = async (propertyDetails) => {
  try {
    const adminEmail = "alkardorhd@gmail.com";
    const { title, landlordName, landlordEmail, city, price, propertyId } = propertyDetails;
    
    const reviewUrl = `${config.FRONTEND_URL}/admin/properties`;

    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.GMAIL_USER}>`,
      to: adminEmail,
      subject: "New Property Listing - Action Required",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .property-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .footer { text-align: center; color: #777; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Property Listing</h1>
              <p>A new property has been submitted for review</p>
            </div>
            <div class="content">
              <div class="property-details">
                <h2 style="margin-top: 0; color: #667eea;">${title}</h2>
                <div class="detail-row">
                  <span class="label">Property ID:</span>
                  <span class="value">${propertyId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Landlord:</span>
                  <span class="value">${landlordName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${landlordEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Location:</span>
                  <span class="value">${city}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <span class="value">₹${price}/month</span>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p><strong>Action Required:</strong> Please review this property listing</p>
                <a href="${reviewUrl}" class="button">Review Property</a>
              </div>
              
              <p style="color: #777; font-size: 14px; text-align: center;">
                Login to your admin dashboard to approve or decline this listing
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Unirooms. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending admin notification email:", error);
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
  sendNewPropertyNotification,
};
