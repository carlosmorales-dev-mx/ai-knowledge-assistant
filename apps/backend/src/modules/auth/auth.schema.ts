import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email format").transform((value) => value.toLowerCase().trim()),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email format").transform((value) => value.toLowerCase().trim()),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;