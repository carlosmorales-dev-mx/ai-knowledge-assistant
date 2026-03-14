import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import {
    chatMessageSchema,
    chatSessionParamsSchema,
} from "./chat.schemas.js";
import { chatService } from "./chat.service.js";

export class ChatController {
    ask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const parsedBody = chatMessageSchema.parse(req.body);

            const result = await chatService.ask({
                userId: req.user.id,
                message: parsedBody.message,
                sessionId: parsedBody.sessionId,
                limit: parsedBody.limit,
            });

            return res.status(200).json({
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getSessions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const sessions = await chatService.getSessions(req.user.id);

            return res.status(200).json({
                data: sessions,
            });
        } catch (error) {
            next(error);
        }
    };

    getSessionMessages = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const params = chatSessionParamsSchema.parse(req.params);

            const messages = await chatService.getSessionMessages(
                req.user.id,
                params.id,
            );

            return res.status(200).json({
                data: messages,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const chatController = new ChatController();