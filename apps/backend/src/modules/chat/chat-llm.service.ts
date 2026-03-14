import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

export class ChatLlmService {
    private readonly client: GoogleGenAI;

    constructor() {
        this.client = new GoogleGenAI({
            apiKey: env.GEMINI_API_KEY,
        });
    }

    async generateAnswer(prompt: string): Promise<string> {
        try {
            const response = await this.client.models.generateContent({
                model: env.GEMINI_MODEL,
                contents: prompt,
            });

            const text = response.text;

            if (!text || !text.trim()) {
                throw new AppError("LLM response was empty", 502);
            }

            return text.trim();
        } catch (error) {
            throw new AppError("Failed to generate chat response", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}

export const chatLlmService = new ChatLlmService();