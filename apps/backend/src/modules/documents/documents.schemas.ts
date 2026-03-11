import { z } from "zod";

export const documentIdParamsSchema = z.object({
    id: z.string().cuid("Invalid document id"),
});