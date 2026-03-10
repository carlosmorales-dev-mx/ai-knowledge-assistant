import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

type JwtPayload = {
    sub: string;
    email: string;
};

export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
}