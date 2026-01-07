# 🛡️ Security Implementation Guide - Step by Step

## Phase 1: Critical Security Fixes (Implement NOW)

### Step 1: Install Security Packages

```bash
cd server
npm install helmet express-rate-limit express-mongo-sanitize xss-clean hpp cors
```

### Step 2: Create Security Middleware File

**File:** `server/src/Middlewares/security.middleware.js`

```javascript
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    skipSuccessfulRequests: true, // Don't count successful requests
    message: 'Too many login attempts, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Payment rate limiter
export const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 payment attempts per hour
    message: 'Too many payment attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Registration rate limiter
export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registration attempts per hour
    message: 'Too many accounts created from this IP, please try again after an hour.',
    standardHeaders: true,
    legacyHeaders: false,
});
```

### Step 3: Update app.js with Security Middlewares

**File:** `server/src/app.js`

```javascript
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import apiRoutes from "./Routes/index.js";
import { apiLimiter } from "./Middlewares/security.middleware.js";

const app = express();

// 1. Security Headers - FIRST
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://sdk.cashfree.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.cashfree.com", "https://sandbox.cashfree.com"],
            frameSrc: ["https://sdk.cashfree.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// 2. Body parsers with size limits
app.use(express.json({
    limit: "1024KB"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "1024KB"
}));

// 3. Cookie parser
app.use(cookieParser());

// 4. CORS configuration
const corsOptions = {
    origin: ['https://unirooms-in.vercel.app', 'http://localhost:5173', 'https://unirooms.in'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 5. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 6. Data sanitization against XSS
app.use(xss());

// 7. Prevent HTTP Parameter Pollution
app.use(hpp());

// 8. General API rate limiting
app.use('/api/', apiLimiter);

// 9. Request logging (production-safe)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// 10. Routes
app.use("/api/v1", apiRoutes);

// 11. Health check
app.get('/', (req, res) => {
    res.json({
        message: "UniRooms API is up and running!",
        version: "1.0.0",
        status: "active"
    });
});

// 12. Error handling middleware (add this at the end)
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Internal server error'
        });
    } else {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
            stack: err.stack
        });
    }
});

export default app;
```

### Step 4: Update Auth Routes with Rate Limiting

**File:** `server/src/Routes/auth.routes.js`

```javascript
import express from "express";
import {
    registerStudent,
    registerLandlord,
    login,
    // ... other imports
} from "../Controllers/auth.controller.js";
import {
    validateRegistration,
    validateLogin,
    // ... other imports
} from "../Middlewares/validation.middleware.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import { authLimiter, registrationLimiter } from "../Middlewares/security.middleware.js";

const router = express.Router();

// Apply strict rate limiting to auth routes
router.post("/register/student", registrationLimiter, validateRegistration, registerStudent);
router.post("/register/landlord", registrationLimiter, validateRegistration, registerLandlord);
router.post("/login", authLimiter, validateLogin, login);

// ... rest of your routes

export default router;
```

### Step 5: Update Payment Routes with Rate Limiting

**File:** `server/src/Routes/payment.routes.js`

```javascript
import express from "express";
import {
    createPaymentOrder,
    verifyPayment,
    // ... other imports
} from "../Controllers/payment.controller.js";
import { verifyToken, checkRole } from "../Middlewares/auth.middleware.js";
import { paymentLimiter } from "../Middlewares/security.middleware.js";

const router = express.Router();

// Apply payment rate limiting
router.post("/create-order", verifyToken, checkRole("landlord"), paymentLimiter, createPaymentOrder);

// ... rest of your routes

export default router;
```

### Step 6: Remove Sensitive Console.logs

**File:** `server/src/Controllers/payment.controller.js`

```javascript
// REMOVE THESE LINES:
// console.log("Cashfree Response:", JSON.stringify(response.data, null, 2));
// console.log("Sending to frontend:", JSON.stringify(responseData, null, 2));

// REPLACE WITH:
if (process.env.NODE_ENV === 'development') {
    console.log("Payment order created for user:", req.user.id);
}
```

### Step 7: Add Environment Variable Validation

**File:** `server/src/Config/env.config.js`

```javascript
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
  
  // ... rest of config
};

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

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
```

### Step 8: Add Account Lockout Mechanism

**File:** `server/src/Services/auth-security.service.js`

```javascript
import { redisClient } from "./redis.service.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60; // 30 minutes in seconds

export const recordFailedLoginAttempt = async (email) => {
    const key = `login_attempts:${email}`;
    const attempts = await redisClient.incr(key);
    
    if (attempts === 1) {
        // Set expiry on first attempt
        await redisClient.expire(key, LOCKOUT_DURATION);
    }
    
    return attempts;
};

export const isAccountLocked = async (email) => {
    const key = `login_attempts:${email}`;
    const attempts = await redisClient.get(key);
    
    return attempts && parseInt(attempts) >= MAX_LOGIN_ATTEMPTS;
};

export const resetLoginAttempts = async (email) => {
    const key = `login_attempts:${email}`;
    await redisClient.del(key);
};

export const getRemainingAttempts = async (email) => {
    const key = `login_attempts:${email}`;
    const attempts = await redisClient.get(key);
    const attemptsCount = attempts ? parseInt(attempts) : 0;
    
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attemptsCount);
};
```

### Step 9: Update Login Controller with Account Lockout

**File:** `server/src/Controllers/auth.controller.js` (login function)

```javascript
import {
    recordFailedLoginAttempt,
    isAccountLocked,
    resetLoginAttempts,
    getRemainingAttempts
} from "../Services/auth-security.service.js";

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // Check if account is locked
        if (await isAccountLocked(email)) {
            return res.status(429).json({
                success: false,
                message: "Account temporarily locked due to too many failed login attempts. Please try again after 30 minutes.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            await recordFailedLoginAttempt(email);
            const remaining = await getRemainingAttempts(email);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                remainingAttempts: remaining
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            const attempts = await recordFailedLoginAttempt(email);
            const remaining = await getRemainingAttempts(email);
            
            if (attempts >= 5) {
                return res.status(429).json({
                    success: false,
                    message: "Account locked due to too many failed login attempts. Please try again after 30 minutes.",
                });
            }
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                remainingAttempts: remaining
            });
        }

        // Reset attempts on successful login
        await resetLoginAttempts(email);

        // ... rest of login logic
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Error during login"
        });
    }
};
```

---

## Testing Your Security Implementation

### 1. Test Rate Limiting
```bash
# Try making 6 login requests rapidly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### 2. Test XSS Protection
```bash
# Try sending XSS payload
curl -X POST http://localhost:5000/api/v1/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert('XSS')</script>"}'
```

### 3. Test MongoDB Injection
```bash
# Try MongoDB injection
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All security packages installed
- [ ] Helmet configured properly
- [ ] Rate limiting enabled on all routes
- [ ] All console.logs removed or made production-safe
- [ ] Environment variables validated
- [ ] HTTPS enabled
- [ ] Security headers tested
- [ ] XSS protection tested
- [ ] MongoDB injection tested
- [ ] Account lockout tested
- [ ] CORS properly configured
- [ ] Error handling doesn't leak sensitive info

---

**Estimated Implementation Time:** 2-3 hours
**Priority:** CRITICAL - Implement before next deployment
