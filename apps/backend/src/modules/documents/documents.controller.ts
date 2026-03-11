import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import { documentIdParamsSchema } from "./documents.schemas.js";
import { documentsService } from "./documents.service.js";

export class DocumentsController {
    getDocuments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const documents = await documentsService.listUserDocuments(req.user.id);

            res.status(200).json({
                data: documents,
            });
        } catch (error) {
            next(error);
        }
    };

    getDocumentById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const parsedParams = documentIdParamsSchema.parse(req.params);

            const document = await documentsService.getUserDocumentById(
                parsedParams.id,
                req.user.id
            );

            res.status(200).json({
                data: document,
            });
        } catch (error) {
            next(error);
        }
    };

    uploadDocument = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const document = await documentsService.createDocumentUpload({
                userId: req.user.id,
                file: req.file,
            });

            res.status(201).json({
                data: document,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const documentsController = new DocumentsController();