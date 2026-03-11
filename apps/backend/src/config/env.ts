import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(9000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: z.string().default("7d"),

    SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
    SUPABASE_SERVICE_ROLE_KEY: z
        .string()
        .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
    SUPABASE_STORAGE_BUCKET: z
        .string()
        .min(1, "SUPABASE_STORAGE_BUCKET is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid environment variables:",
        parsedEnv.error.flatten().fieldErrors
    );
    process.exit(1);
}

export const env = parsedEnv.data;