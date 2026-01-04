import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRoutes from "./Routes/index.js";

const app = express();

app.use(express.json({
    limit: "1024KB"
}))

app.use(express.urlencoded({
    extended:true,
    limit:"1024KB"
}))

// CORS Configuration - Allow production and development origins
const corsOptions = {
    origin: ['https://unirooms-in.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.get('origin')}`);
    next();
});

app.use(cookieParser());

app.use("/api/v1", apiRoutes);

// Health check endpoint for Render
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: "PG Finder API is up and running!",
        version: "1.0.0",
        status: "active",
        endpoints: {
            auth: "/api/v1/auth",
            properties: "/api/v1/properties",
            payments: "/api/v1/payments",
            reviews: "/api/v1/reviews",
            saved: "/api/v1/saved",
            health: "/api/v1/health"
        }
    });
})
 

export default app;
