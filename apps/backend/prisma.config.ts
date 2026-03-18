import { defineConfig, env } from "prisma/config";
import "dotenv/config";

function sanitizeEnvValue(value: string) {
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: sanitizeEnvValue(env("DATABASE_URL")),
  },
});