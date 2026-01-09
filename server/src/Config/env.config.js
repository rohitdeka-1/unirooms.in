import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "7d",
  
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  
  FRONTEND_URL: process.env.FRONTEND_URL || "https://unirooms-in.vercel.app",
  CLIENT_URL: process.env.CLIENT_URL || process.env.FRONTEND_URL || "https://unirooms.in",
  
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
  CASHFREE_ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT || "TEST",
  
  GMAIL_USER: process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.SMTP_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.SMTP_PASS,
  GMAIL_USE_SSL: process.env.GMAIL_USE_SSL === "true",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "UniRooms",
  
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  USE_SENDGRID: process.env.USE_SENDGRID === "true",
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.GMAIL_USER,
  
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880,
  MAX_FILES: process.env.MAX_FILES || 10,
};

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

// Validate required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach(envVar => console.error(`  - ${envVar}`));
  process.exit(1);
}

// Validate JWT secrets are strong enough
if (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length < 32) {
  console.warn("⚠️  WARNING: JWT_ACCESS_SECRET should be at least 32 characters long");
}

if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
  console.warn("⚠️  WARNING: JWT_REFRESH_SECRET should be at least 32 characters long");
}

export default config;
