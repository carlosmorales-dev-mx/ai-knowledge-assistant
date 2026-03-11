import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/app-error.js";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            details: error.details ?? null,
        });
        return;
    }

    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            details: error.flatten(),
        });
        return;
    }

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                message: "File size exceeds the maximum allowed limit of 10 MB",
                details: null,
            });
            return;
        }

        res.status(400).json({
            success: false,
            message: error.message,
            details: null,
        });
        return;
    }

    console.error("Unhandled error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}