import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { chatController } from "./chat.controller.js";

const router = Router();

router.post("/", authMiddleware, chatController.ask);

export default router;