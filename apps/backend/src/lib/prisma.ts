import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../config/env.js";

function sanitizeEnvValue(value: string) {
    return value.trim().replace(/^['"]+|['"]+$/g, "");
}

const connectionString = sanitizeEnvValue(env.DATABASE_URL);

const pool = new Pool({
    connectionString,
});

const adapter = new PrismaPg(pool as any);

export const prisma = new PrismaClient({
    adapter,
});