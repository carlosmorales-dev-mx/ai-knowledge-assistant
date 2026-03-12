import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

export class DocumentEmbeddingsService {
    private readonly client: GoogleGenAI;
    private readonly model = "gemini-embedding-001";

    constructor() {
        this.client = new GoogleGenAI({
            apiKey: env.GEMINI_API_KEY,
        });
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const normalizedText = text.trim();

        if (!normalizedText) {
            throw new AppError("Cannot generate embedding for empty text", 400);
        }

        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.client.models.embedContent({
                    model: this.model,
                    contents: normalizedText,
                });

                const values = response.embeddings?.[0]?.values;

                if (!values || values.length === 0) {
                    throw new AppError("Embedding response was empty", 502);
                }

                return values;

            } catch (error) {

                if (attempt === maxRetries) {
                    throw new AppError("Failed to generate embedding", 502, {
                        cause: error instanceof Error ? error.message : "Unknown error",
                    });
                }

                // exponential backoff
                const delay = attempt * 1500;

                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        throw new AppError("Embedding generation failed", 502);
    }

    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const normalizedTexts = texts
            .map((text) => text.trim())
            .filter((text) => text.length > 0);

        if (normalizedTexts.length === 0) {
            throw new AppError("Cannot generate embeddings for empty texts", 400);
        }

        const embeddings: number[][] = [];

        for (const text of normalizedTexts) {
            const embedding = await this.generateEmbedding(text);
            embeddings.push(embedding);

            // small delay to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        return embeddings;
    }
}

export const documentEmbeddingsService = new DocumentEmbeddingsService();