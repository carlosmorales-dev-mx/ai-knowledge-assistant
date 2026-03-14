import { MessageRole } from "@prisma/client";
import { documentEmbeddingsService } from "../documents/document-embeddings.service.js";
import { documentVectorStoreService } from "../documents/document-vector-store.service.js";
import { chatContextService } from "./chat-context.service.js";
import { chatLlmService } from "./chat-llm.service.js";
import { chatMemoryService } from "./chat-memory.service.js";

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

type ChatSource = {
    id: string;
    documentId: string | null;
    filename: string | null;
    chunkIndex: number | null;
    content: string | null;
    distance: number | null;
};

type AskInput = {
    userId: string;
    message: string;
    sessionId?: string;
    limit?: number;
};

type RecentMessage = {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
};

export class ChatService {
    async ask(input: AskInput) {
        const { userId, message, sessionId, limit = 5 } = input;
        const isNewSession = !sessionId;

        /**
         * 1) Resolve session
         */
        const session = await chatMemoryService.resolveSession(userId, sessionId);

        /**
         * 2) Auto-title only when session is newly created
         */
        if (isNewSession) {
            const generatedTitle = this.generateSessionTitle(message);
            await chatMemoryService.updateSessionTitle(session.id, generatedTitle);
        }

        /**
         * 3) Persist user message first
         */
        await chatMemoryService.createUserMessage(session.id, message);

        /**
         * 4) Load recent conversation memory
         */
        const recentMessages = await chatMemoryService.getRecentMessages(
            session.id,
            6,
        );

        const conversationHistory =
            chatContextService.buildConversationHistory(recentMessages);

        /**
         * 5) Build better retrieval query for follow-up questions
         */
        const retrievalQuery = this.buildRetrievalQuery({
            message,
            recentMessages,
        });

        /**
         * 6) Generate embedding for retrieval query
         */
        const queryEmbedding =
            await documentEmbeddingsService.generateEmbedding(retrievalQuery);

        /**
         * 7) Retrieve relevant chunks from vector store
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
            (result) => result.content && result.metadata,
        );

        /**
         * 8) Fallback if no valid results were retrieved
         */
        if (validResults.length === 0) {
            const fallback = "No relevant document context found for this user.";

            await chatMemoryService.createAssistantMessage(session.id, fallback);
            await chatMemoryService.touchSession(session.id);

            return {
                sessionId: session.id,
                answer: null,
                fallback,
                sources: [] as ChatSource[],
            };
        }

        /**
         * 9) Intelligent context packing
         */
        const DISTANCE_THRESHOLD = 0.8;
        const MAX_CONTEXT_CHARS = 4000;

        const filteredResults = validResults
            .filter(
                (result) =>
                    result.distance !== null && result.distance < DISTANCE_THRESHOLD,
            )
            .sort((a, b) => (a.distance ?? 1) - (b.distance ?? 1));

        const packedSources: ChatSource[] = [];
        let packedContextLength = 0;

        for (const result of filteredResults) {
            const source: ChatSource = {
                id: result.id,
                documentId: result.metadata?.documentId ?? null,
                filename: result.metadata?.filename ?? null,
                chunkIndex: result.metadata?.chunkIndex ?? null,
                content: result.content,
                distance: result.distance,
            };

            const sourceBlock = [
                `[Source ${packedSources.length + 1}]`,
                `Filename: ${source.filename ?? "unknown"}`,
                `Chunk index: ${source.chunkIndex ?? -1}`,
                "Content:",
                source.content ?? "",
                "",
            ].join("\n");

            if (packedContextLength + sourceBlock.length > MAX_CONTEXT_CHARS) {
                break;
            }

            packedSources.push(source);
            packedContextLength += sourceBlock.length;
        }

        /**
         * 10) Fallback if similarity filtering removed everything
         */
        if (packedSources.length === 0) {
            const fallback =
                "Relevant chunks were found, but none passed the similarity threshold.";

            await chatMemoryService.createAssistantMessage(session.id, fallback);
            await chatMemoryService.touchSession(session.id);

            return {
                sessionId: session.id,
                answer: null,
                fallback,
                sources: [],
            };
        }

        /**
         * 11) Build final prompt with conversation history + retrieved context
         */
        const retrievedContext =
            chatContextService.buildSourcesContext(packedSources);

        const finalPrompt = chatContextService.buildPrompt({
            message,
            history: conversationHistory,
            context: retrievedContext,
        });

        /**
         * 12) Generate answer using LLM
         */
        try {
            const answer = await chatLlmService.generateAnswer(finalPrompt);

            await chatMemoryService.createAssistantMessage(session.id, answer);
            await chatMemoryService.touchSession(session.id);

            return {
                sessionId: session.id,
                answer,
                fallback: null,
                sources: packedSources,
            };
        } catch (_error) {
            const fallback =
                "LLM quota exceeded or generation failed. Returning retrieved sources only.";

            await chatMemoryService.createAssistantMessage(session.id, fallback);
            await chatMemoryService.touchSession(session.id);

            return {
                sessionId: session.id,
                answer: null,
                fallback,
                sources: packedSources,
            };
        }
    }

    async getSessions(userId: string) {
        return chatMemoryService.getUserSessions(userId);
    }

    async getSessionMessages(userId: string, sessionId: string) {
        return chatMemoryService.getSessionMessages(userId, sessionId);
    }

    private buildRetrievalQuery(input: {
        message: string;
        recentMessages: RecentMessage[];
    }) {
        const { message, recentMessages } = input;

        if (!this.isFollowUpMessage(message)) {
            return message;
        }

        const previousUserMessage = this.findPreviousUserMessage(
            recentMessages,
            message,
        );

        if (!previousUserMessage) {
            return message;
        }

        return `${previousUserMessage.content}\n\nFollow-up request: ${message}`;
    }

    private findPreviousUserMessage(
        messages: RecentMessage[],
        currentMessage: string,
    ) {
        const userMessages = messages.filter(
            (messageItem) =>
                messageItem.role === MessageRole.USER &&
                messageItem.content.trim() !== currentMessage.trim(),
        );

        if (!userMessages.length) {
            return null;
        }

        return userMessages[userMessages.length - 1] ?? null;
    }

    private isFollowUpMessage(message: string) {
        const normalized = message.trim().toLowerCase();

        if (normalized.length <= 30) {
            return true;
        }

        const followUpPatterns = [
            "explícamelo",
            "explicamelo",
            "más simple",
            "mas simple",
            "resúmelo",
            "resumelo",
            "resume",
            "amplía",
            "amplia",
            "dime más",
            "dime mas",
            "qué significa",
            "que significa",
            "cómo así",
            "como asi",
            "por qué",
            "porque",
            "why",
            "explain it simply",
            "summarize it",
            "tell me more",
        ];

        return followUpPatterns.some((pattern) => normalized.includes(pattern));
    }

    private generateSessionTitle(message: string) {
        const normalized = message
            .replace(/\s+/g, " ")
            .replace(/^[¿?¡!.\-_:;,]+/, "")
            .replace(/[¿?¡!.\-_:;,]+$/, "")
            .trim();

        if (!normalized) {
            return "New chat";
        }

        const maxLength = 60;

        if (normalized.length <= maxLength) {
            return normalized;
        }

        return `${normalized.slice(0, maxLength).trimEnd()}...`;
    }
}

export const chatService = new ChatService();