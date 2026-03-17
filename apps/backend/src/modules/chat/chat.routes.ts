import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { chatController } from "./chat.controller.js";

const router = Router();

router.post("/", authMiddleware, chatController.ask);
router.get("/sessions", authMiddleware, chatController.getSessions);
router.get(
    "/sessions/:id/messages",
    authMiddleware,
    chatController.getSessionMessages,
);
router.patch(
    "/sessions/:id",
    authMiddleware,
    chatController.renameSession,
);
router.delete(
    "/sessions/:id",
    authMiddleware,
    chatController.deleteSession,
);

export default router;