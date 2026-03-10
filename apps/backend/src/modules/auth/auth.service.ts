import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

type SafeUser = {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
};

type AuthResponse = {
    user: SafeUser;
    accessToken: string;
};

export class AuthService {
    static async register(data: RegisterInput): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError("Email is already in use", 409);
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const accessToken = jwt.sign(
            { sub: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
        );

        return {
            user,
            accessToken,
        };
    }

    static async login(data: LoginInput): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const accessToken = jwt.sign(
            { sub: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            accessToken,
        };
    }

    static async me(userId: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }
}