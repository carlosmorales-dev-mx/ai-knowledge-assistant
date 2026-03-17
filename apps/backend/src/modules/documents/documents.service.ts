import { randomUUID } from "node:crypto";
import { AppError } from "../../shared/errors/app-error.js";
import { documentProcessingService } from "./document-processing.service.js";
import { documentStorageService } from "./document-storage.service.js";
import { documentEmbeddingsService } from "./document-embeddings.service.js";
import { documentVectorStoreService } from "./document-vector-store.service.js";
import { documentsRepository } from "./documents.repository.js";

function sanitizeFilename(originalName: string): string {
    const withoutExtension = originalName.replace(/\.pdf$/i, "");

    const sanitizedBase = withoutExtension
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();

    return `${sanitizedBase || "document"}.pdf`;
}

export class DocumentsService {
    async listUserDocuments(userId: string) {
        return documentsRepository.findManyByUserId(userId);
    }

    async getUserDocumentById(documentId: string, userId: string) {
        const document = await documentsRepository.findByIdAndUserId(
            documentId,
            userId
        );

        if (!document) {
            throw new AppError("Document not found", 404);
        }

        return document;
    }

    async getUserDocumentChunksById(documentId: string, userId: string) {
        const documentWithChunks =
            await documentsRepository.findDocumentWithChunksByIdAndUserId(
                documentId,
                userId
            );

        if (!documentWithChunks) {
            throw new AppError("Document not found", 404);
        }

        return {
            document: {
                id: documentWithChunks.id,
                filename: documentWithChunks.filename,
                originalName: documentWithChunks.originalName,
                status: documentWithChunks.status,
                chunkCount: documentWithChunks.chunkCount,
                processedAt: documentWithChunks.processedAt,
                createdAt: documentWithChunks.createdAt,
                updatedAt: documentWithChunks.updatedAt,
            },
            chunks: documentWithChunks.chunks.map((chunk) => ({
                id: chunk.id,
                chunkIndex: chunk.chunkIndex,
                content: chunk.content,
                length: chunk.content.length,
                vectorId: chunk.vectorId,
                createdAt: chunk.createdAt,
            })),
        };
    }

    async searchUserDocumentChunks(input: {
        query: string;
        userId: string;
        limit?: number;
    }) {
        const { query, userId, limit } = input;

        const embedding = await documentEmbeddingsService.generateEmbedding(query);

        const result = await documentVectorStoreService.querySimilarChunks({
            embedding,
            userId,
            limit,
        });

        const ids = result.ids?.[0] ?? [];
        const documents = result.documents?.[0] ?? [];
        const metadatas = result.metadatas?.[0] ?? [];
        const distances = result.distances?.[0] ?? [];

        return ids.map((id, index) => ({
            id,
            content: documents[index] ?? null,
            metadata: metadatas[index] ?? null,
            distance: distances[index] ?? null,
        }));
    }
    async deleteUserDocument(documentId: string, userId: string) {
        const document = await documentsRepository.findDocumentForDelete(
            documentId,
            userId
        );

        if (!document) {
            throw new AppError("Document not found", 404);
        }

        await documentsRepository.deleteByIdAndUserId(documentId, userId);

        return { success: true };
    }
    async createDocumentUpload(input: {
        userId: string;
        file: Express.Multer.File | undefined;
    }) {
        const { userId, file } = input;

        if (!file) {
            throw new AppError("PDF file is required", 400);
        }

        if (file.mimetype !== "application/pdf") {
            throw new AppError("Only PDF files are allowed", 400);
        }

        const documentId = randomUUID();
        const filename = sanitizeFilename(file.originalname);
        const storagePath = `documents/${userId}/${documentId}/${filename}`;

        await documentStorageService.upload({
            storagePath,
            fileBuffer: file.buffer,
            mimeType: file.mimetype,
        });

        await documentsRepository.create({
            id: documentId,
            userId,
            filename,
            originalName: file.originalname,
            storagePath,
            mimeType: file.mimetype,
            fileSize: file.size,
        });

        await documentProcessingService.process(documentId);

        return documentsRepository.findByIdAndUserId(documentId, userId);
    }
}

export const documentsService = new DocumentsService();