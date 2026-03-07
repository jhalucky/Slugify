import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "node:http2";
import { connectToMongoDB, connectPrisma, connectRedis } from "./config/db.js";
import { log } from "node:console";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from './routes/url.routes.js'
import { redirectUrl } from './controllers/url.controller.js'
import { startAnalyticsWorker } from "./queues/analytics.worker.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import rateLimit from "express-rate-limit";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs for auth routes   
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: "Too many login attempts, please try again later." }
});

app.use(globalLimiter);


app.use(helmet())
   .use(cors())
   .use(express.json());

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/urls", urlRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/:slug", redirectUrl);

app.get("/health", (req, res)=> {
    res.json({ status: "ok", message: "Service is running" });
});

const start = async() => {
    await connectToMongoDB();
    await connectPrisma();
    await connectRedis();
    startAnalyticsWorker();
    app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`)
    
});   
}

start();




export default app;