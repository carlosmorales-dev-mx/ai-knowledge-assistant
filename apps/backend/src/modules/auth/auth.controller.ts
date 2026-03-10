import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export class AuthController {
    static async register(req: Request, res: Response) {
        const data = registerSchema.parse(req.body);
        const result = await AuthService.register(data);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }

    static async login(req: Request, res: Response) {
        const data = loginSchema.parse(req.body);
        const result = await AuthService.login(data);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }

    static async me(req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const user = await AuthService.me(userId);

        res.status(200).json({
            success: true,
            message: "Authenticated user fetched successfully",
            data: user,
        });
    }
}