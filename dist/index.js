import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo, connectPrisma } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet())
    .use(cors())
    .use(express.json());
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Service is running" });
});
const start = async () => {
    await connectMongo();
    await connectPrisma();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });
};
start();
export default app;
//# sourceMappingURL=index.js.map