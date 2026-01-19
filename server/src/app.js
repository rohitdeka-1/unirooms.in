import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./Routes/index.js";
import { apiLimiter } from "./Middlewares/security.middleware.js";
import Property from "./Models/property.model.js";
import { generatePropertyHTML, generateDefaultHTML } from "./Utils/htmlTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

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

app.use(express.json({
    limit: "1024KB"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "1024KB"
}));


app.use(cookieParser());


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

app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                if (key.includes('$') || key.includes('.')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            });
        }
        return obj;
    };

    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);

    next();
});

app.use(hpp());


app.use('/api/', apiLimiter);

app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use('/api/', (req, res, next) => {
    if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'public, max-age=300');
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
});

app.use("/api/v1", apiRoutes);

// Serve static files from React build (if available in production)
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// API root endpoint - must come before catch-all
app.get('/api', (req, res) => {
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

// Special handling for property pages - serve HTML with dynamic meta tags
app.get('/property/:id', async (req, res, next) => {
    try {
        // Check if request is from a bot/crawler
        const userAgent = req.headers['user-agent'] || '';
        const isBot = /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|twitter|telegram/i.test(userAgent);
        
        if (isBot) {
            // Serve HTML with dynamic meta tags for bots
            const property = await Property.findById(req.params.id)
                .select('title description images rent price city nearbyCollege roomType gender address location totalRooms state isVerified')
                .lean();

            if (!property || !property.isVerified) {
                return res.status(404).sendFile(path.join(clientBuildPath, 'index.html'));
            }

            const html = generatePropertyHTML(property);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
            return res.send(html);
        } else {
            // For regular users, serve the React app
            return res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
    } catch (error) {
        console.error('Error serving property page:', error);
        next();
    }
});

// Catch-all route - serve React app for all other routes
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
        if (err) {
            next();
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

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
