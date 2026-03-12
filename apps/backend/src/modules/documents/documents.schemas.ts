import { z } from "zod";

export const documentIdParamsSchema = z.object({
    id: z.string().uuid("Invalid document id"),
});

export const documentSearchSchema = z.object({
    query: z.string().min(1, "Query is required"),
    limit: z.number().int().min(1).max(20).default(5),
});