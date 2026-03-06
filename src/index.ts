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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet())
   .use(cors())
   .use(express.json());

app.use("/api/auth", authRoutes);
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