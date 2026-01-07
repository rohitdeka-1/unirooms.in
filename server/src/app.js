import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
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
    origin: ['https://unirooms-in.vercel.app', 'http://localhost:5173','https://unirooms.in'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 5. Data sanitization against NoSQL query injection
// Use replaceWith option for Express 5.x compatibility
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Sanitized key: ${key}`);
        }
    }
}));

// 6. Prevent HTTP Parameter Pollution
app.use(hpp());

// 7. General API rate limiting
app.use('/api/', apiLimiter);

// 8. Request logging (production-safe)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use("/api/v1", apiRoutes);



app.get('/', (req, res) => {
    res.json({
        message: "UniRooms API is up and running!",
        version: "1.0.0",
        status: "active",
        endpoints: {
            auth: "/api/v1/auth",
            properties: "/api/v1/properties",
            payments: "/api/v1/payments",
            reviews: "/api/v1/reviews",
            saved: "/api/v1/saved",
        }
    });
});

// Error handling middleware
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
