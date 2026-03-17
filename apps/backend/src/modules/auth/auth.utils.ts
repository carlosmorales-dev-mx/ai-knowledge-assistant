import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

type JwtPayload = {
    sub: string;
    email: string;
};

type UserLike = {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
};

export type SafeUser = {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
};

export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}

export function toSafeUser(user: UserLike): SafeUser {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}