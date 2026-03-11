import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../shared/errors/app-error.js";

type AuthPayload = {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
};

export function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new AppError("Authorization header is required", 401));
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return next(new AppError("Invalid authorization format", 401));
        }

        const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

        req.user = {
            id: payload.sub,
            email: payload.email,
        };

        next();
    } catch {
        next(new AppError("Invalid or expired token", 401));
    }
}