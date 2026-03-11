import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import documentsRoutes from "./modules/documents/documents.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running",
    });
});

app.use("/auth", authRoutes);
app.use("/documents", documentsRoutes);

app.use(errorHandler);

export default app;