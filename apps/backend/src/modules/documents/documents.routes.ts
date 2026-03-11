import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { documentUploadMiddleware } from "./documents-upload.config.js";
import { documentsController } from "./documents.controller.js";

const router = Router();

router.get("/", authMiddleware, documentsController.getDocuments);
router.get("/:id", authMiddleware, documentsController.getDocumentById);
router.post(
    "/upload",
    authMiddleware,
    documentUploadMiddleware.single("file"),
    documentsController.uploadDocument
);

export default router;