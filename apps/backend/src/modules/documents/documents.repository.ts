import { DocumentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export class DocumentsRepository {
    async findManyByUserId(userId: string) {
        return prisma.document.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                fileSize: true,
                status: true,
                chunkCount: true,
                processedAt: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findByIdAndUserId(documentId: string, userId: string) {
        return prisma.document.findFirst({
            where: {
                id: documentId,
                userId,
            },
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                fileSize: true,
                status: true,
                errorMessage: true,
                chunkCount: true,
                processedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async create(data: {
        id: string;
        userId: string;
        filename: string;
        originalName: string;
        storagePath: string;
        mimeType: string;
        fileSize: number;
        status?: DocumentStatus;
    }) {
        return prisma.document.create({
            data: {
                id: data.id,
                userId: data.userId,
                filename: data.filename,
                originalName: data.originalName,
                storagePath: data.storagePath,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                status: data.status ?? DocumentStatus.UPLOADED,
            },
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                fileSize: true,
                status: true,
                chunkCount: true,
                processedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateStatus(params: {
        documentId: string;
        status: DocumentStatus;
        errorMessage?: string | null;
        chunkCount?: number;
        processedAt?: Date | null;
    }) {
        const {
            documentId,
            status,
            errorMessage,
            chunkCount,
            processedAt,
        } = params;

        return prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                status,
                errorMessage,
                chunkCount,
                processedAt,
            },
        });
    }

    async replaceChunks(params: {
        documentId: string;
        chunks: Array<{
            chunkIndex: number;
            content: string;
        }>;
    }) {
        const { documentId, chunks } = params;

        return prisma.$transaction(async (tx) => {
            await tx.documentChunk.deleteMany({
                where: {
                    documentId,
                },
            });

            if (chunks.length > 0) {
                await tx.documentChunk.createMany({
                    data: chunks.map((chunk) => ({
                        documentId,
                        chunkIndex: chunk.chunkIndex,
                        content: chunk.content,
                    })),
                });
            }
        });
    }

    async findStoragePathById(documentId: string) {
        return prisma.document.findUnique({
            where: {
                id: documentId,
            },
            select: {
                id: true,
                storagePath: true,
                status: true,
            },
        });
    }
}

export const documentsRepository = new DocumentsRepository();