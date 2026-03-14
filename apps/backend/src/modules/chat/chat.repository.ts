import { PrismaClient, MessageRole } from '@prisma/client';

export class ChatRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async createSession(userId: string) {
        return this.prisma.chatSession.create({
            data: {
                userId,
            },
            select: {
                id: true,
                userId: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findUserSessionById(userId: string, sessionId: string) {
        return this.prisma.chatSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
            select: {
                id: true,
                userId: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async listUserSessions(userId: string) {
        return this.prisma.chatSession.findMany({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createMessage(
        sessionId: string,
        role: MessageRole,
        content: string,
    ) {
        return this.prisma.chatMessage.create({
            data: {
                chatSessionId: sessionId,
                role,
                content,
            },
            select: {
                id: true,
                chatSessionId: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });
    }

    async listSessionMessages(sessionId: string) {
        return this.prisma.chatMessage.findMany({
            where: {
                chatSessionId: sessionId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });
    }

    async listRecentSessionMessages(sessionId: string, limit: number) {
        const messages = await this.prisma.chatMessage.findMany({
            where: {
                chatSessionId: sessionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });

        return messages.reverse();
    }

    async touchSession(sessionId: string) {
        return this.prisma.chatSession.update({
            where: {
                id: sessionId,
            },
            data: {},
            select: {
                id: true,
                userId: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}