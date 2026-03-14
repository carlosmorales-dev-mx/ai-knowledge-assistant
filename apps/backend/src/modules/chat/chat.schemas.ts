import { z } from "zod";

export const chatMessageSchema = z.object({
    message: z.string().trim().min(1, "Message is required"),
    sessionId: z.string().trim().min(1).optional(),
    limit: z.number().int().min(1).max(10).default(5),
});

export const chatSessionParamsSchema = z.object({
    id: z.string().trim().min(1, "Session id is required"),
});