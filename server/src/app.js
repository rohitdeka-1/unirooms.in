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

app.use(
    cors({
        origin:["*"],
    })
)

app.use(cookieParser());

app.use("/api/v1", apiRoutes);

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
            health: "/"
        }
    });
})
 

export default app;
