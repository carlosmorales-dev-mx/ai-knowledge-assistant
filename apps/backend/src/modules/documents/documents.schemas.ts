import { z } from "zod";

export const documentIdParamsSchema = z.object({
    id: z.string().uuid("Invalid document id"),
});