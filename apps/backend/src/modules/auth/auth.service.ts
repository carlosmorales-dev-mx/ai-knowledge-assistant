import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { generateAccessToken, SafeUser, toSafeUser } from "./auth.utils.js";

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

        const createdUser = await prisma.user.create({
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

        const user = toSafeUser(createdUser);

        const accessToken = generateAccessToken({
            sub: user.id,
            email: user.email,
        });

        return {
            user,
            accessToken,
        };
    }

    static async login(data: LoginInput): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!existingUser) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            existingUser.passwordHash
        );

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const user = toSafeUser(existingUser);

        const accessToken = generateAccessToken({
            sub: user.id,
            email: user.email,
        });

        return {
            user,
            accessToken,
        };
    }

    static async me(userId: string): Promise<SafeUser> {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!existingUser) {
            throw new AppError("User not found", 404);
        }

        return toSafeUser(existingUser);
    }
}