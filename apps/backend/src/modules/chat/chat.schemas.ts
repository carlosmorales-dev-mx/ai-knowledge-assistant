import { z } from "zod";

export const chatMessageSchema = z.object({
    message: z.string().trim().min(1, "Message is required"),
    sessionId: z.string().trim().min(1).optional(),
    limit: z.number().int().min(1).max(10).default(5),
});

export const chatSessionParamsSchema = z.object({
    id: z.string().trim().min(1, "Session id is required"),
});

export const chatMessagesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const renameChatSessionSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(120, "Title must be at most 120 characters"),
});