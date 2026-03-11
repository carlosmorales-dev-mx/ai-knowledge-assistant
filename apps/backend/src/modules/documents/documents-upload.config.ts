import multer from "multer";
import { AppError } from "../../shared/errors/app-error.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

export const documentUploadMiddleware = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new AppError("Only PDF files are allowed", 400));
        }

        cb(null, true);
    },
});