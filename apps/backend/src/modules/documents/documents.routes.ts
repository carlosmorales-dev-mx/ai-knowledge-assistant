import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { documentUploadMiddleware } from "./documents-upload.config.js";
import { documentsController } from "./documents.controller.js";

const router = Router();

router.get("/", authMiddleware, documentsController.getDocuments);

router.post(
    "/search",
    authMiddleware,
    documentsController.searchDocumentChunks
);

router.get("/:id/chunks", authMiddleware, documentsController.getDocumentChunks);

router.get("/:id", authMiddleware, documentsController.getDocumentById);

router.delete("/:id", authMiddleware, documentsController.deleteDocument);

router.post(
    "/upload",
    authMiddleware,
    documentUploadMiddleware.single("file"),
    documentsController.uploadDocument
);

export default router;