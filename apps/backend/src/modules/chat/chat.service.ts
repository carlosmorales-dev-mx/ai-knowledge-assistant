import { documentEmbeddingsService } from "../documents/document-embeddings.service.js";
import { documentVectorStoreService } from "../documents/document-vector-store.service.js";
import { chatLlmService } from "./chat-llm.service.js";

type RetrievalResult = {
    id: string;
    content: string | null;
    metadata: {
        userId?: string;
        documentId?: string;
        filename?: string;
        chunkIndex?: number;
        chunkId?: string;
    } | null;
    distance: number | null;
};

export class ChatService {
    async ask(input: {
        userId: string;
        message: string;
        limit?: number;
    }) {
        const { userId, message, limit } = input;

        /**
         * 1️⃣ Generate embedding for the user query
         */
        const queryEmbedding =
            await documentEmbeddingsService.generateEmbedding(message);

        /**
         * 2️⃣ Retrieve relevant chunks from Chroma
         */
        const retrievalResult =
            await documentVectorStoreService.querySimilarChunks({
                embedding: queryEmbedding,
                userId,
                limit,
            });

        const ids = retrievalResult.ids?.[0] ?? [];
        const documents = retrievalResult.documents?.[0] ?? [];
        const metadatas = retrievalResult.metadatas?.[0] ?? [];
        const distances = retrievalResult.distances?.[0] ?? [];

        const results: RetrievalResult[] = ids.map((id, index) => ({
            id,
            content: documents[index] ?? null,
            metadata: metadatas[index] ?? null,
            distance: distances[index] ?? null,
        }));

        const validResults = results.filter(
            (result) => result.content && result.metadata
        );

        if (validResults.length === 0) {
            return {
                answer: null,
                fallback: "No relevant document context found for this user.",
                sources: [],
            };
        }

        /**
         * 3️⃣ Context Window Packing Inteligente
         */

        const DISTANCE_THRESHOLD = 0.8;
        const MAX_CONTEXT_CHARS = 4000;

        const filteredResults = validResults
            .filter((r) => r.distance !== null && r.distance < DISTANCE_THRESHOLD)
            .sort((a, b) => (a.distance ?? 1) - (b.distance ?? 1));

        let context = "";
        let contextLength = 0;
        let sourceIndex = 1;

        for (const result of filteredResults) {
            const filename = result.metadata?.filename ?? "unknown";
            const chunkIndex = result.metadata?.chunkIndex ?? -1;
            const content = result.content ?? "";

            const block = [
                `[Source ${sourceIndex}]`,
                `Filename: ${filename}`,
                `Chunk index: ${chunkIndex}`,
                `Content:`,
                content,
                "",
            ].join("\n");

            if (contextLength + block.length > MAX_CONTEXT_CHARS) {
                break;
            }

            context += block + "\n---\n\n";
            contextLength += block.length;
            sourceIndex++;
        }

        /**
         * 4️⃣ Generate answer with LLM
         */

        try {
            const answer = await chatLlmService.generateAnswer({
                question: message,
                context,
            });

            return {
                answer,
                fallback: null,
                sources: filteredResults.map((result) => ({
                    id: result.id,
                    documentId: result.metadata?.documentId ?? null,
                    filename: result.metadata?.filename ?? null,
                    chunkIndex: result.metadata?.chunkIndex ?? null,
                    content: result.content,
                    distance: result.distance,
                })),
            };
        } catch (_error) {
            /**
             * 5️⃣ Graceful fallback if LLM fails
             */
            return {
                answer: null,
                fallback:
                    "LLM quota exceeded or generation failed. Returning retrieved sources only.",
                sources: filteredResults.map((result) => ({
                    id: result.id,
                    documentId: result.metadata?.documentId ?? null,
                    filename: result.metadata?.filename ?? null,
                    chunkIndex: result.metadata?.chunkIndex ?? null,
                    content: result.content,
                    distance: result.distance,
                })),
            };
        }
    }
}

export const chatService = new ChatService();