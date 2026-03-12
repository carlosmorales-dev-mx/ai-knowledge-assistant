import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import { chatMessageSchema } from "./chat.schemas.js";
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
                limit: parsedBody.limit,
            });

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const chatController = new ChatController();