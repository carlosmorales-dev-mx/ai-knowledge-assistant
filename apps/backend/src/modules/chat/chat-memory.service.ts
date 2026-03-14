import { MessageRole } from "@prisma/client";
import { ChatRepository } from "./chat.repository.js";
import { prisma } from "../../lib/prisma.js";

class NotFoundError extends Error {
    public readonly statusCode: number;

    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

const chatRepository = new ChatRepository(prisma);

export class ChatMemoryService {
    constructor(private readonly repository: ChatRepository) { }

    async createSession(userId: string) {
        return this.repository.createSession(userId);
    }

    async getUserSessionOrThrow(userId: string, sessionId: string) {
        const session = await this.repository.findUserSessionById(userId, sessionId);

        if (!session) {
            throw new NotFoundError("Chat session not found");
        }

        return session;
    }

    async resolveSession(userId: string, sessionId?: string) {
        if (!sessionId) {
            return this.createSession(userId);
        }

        return this.getUserSessionOrThrow(userId, sessionId);
    }

    async updateSessionTitle(sessionId: string, title: string) {
        return this.repository.updateSessionTitle(sessionId, title);
    }

    async createUserMessage(sessionId: string, content: string) {
        return this.repository.createMessage(sessionId, MessageRole.USER, content);
    }

    async createAssistantMessage(sessionId: string, content: string) {
        return this.repository.createMessage(
            sessionId,
            MessageRole.ASSISTANT,
            content,
        );
    }

    async getRecentMessages(sessionId: string, limit = 6) {
        return this.repository.listRecentSessionMessages(sessionId, limit);
    }

    async getUserSessions(userId: string) {
        return this.repository.listUserSessions(userId);
    }

    async getSessionMessages(
        userId: string,
        sessionId: string,
        page: number,
        pageSize: number,
    ) {
        await this.getUserSessionOrThrow(userId, sessionId);

        return this.repository.listSessionMessagesPaginated(
            sessionId,
            page,
            pageSize,
        );
    }

    async touchSession(sessionId: string) {
        return this.repository.touchSession(sessionId);
    }
}

export const chatMemoryService = new ChatMemoryService(chatRepository);