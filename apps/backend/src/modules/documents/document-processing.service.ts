import { DocumentStatus } from "@prisma/client";
import { documentsRepository } from "./documents.repository.js";
import { documentStorageService } from "./document-storage.service.js";
import { pdfParserService } from "./pdf-parser.service.js";
import { textChunkerService } from "./text-chunker.service.js";
import { documentEmbeddingsService } from "./document-embeddings.service.js";
import { documentVectorStoreService } from "./document-vector-store.service.js";
import { buildChunkVectorId } from "./documents-vector.utils.js";

export class DocumentProcessingService {
    async process(documentId: string): Promise<void> {
        try {
            await documentsRepository.updateStatus({
                documentId,
                status: DocumentStatus.PROCESSING,
                errorMessage: null,
            });

            const document =
                await documentsRepository.findDocumentForProcessingById(documentId);

            if (!document) {
                throw new Error("Document not found during processing");
            }

            const fileBuffer = await documentStorageService.download(
                document.storagePath
            );

            const extractedText = await pdfParserService.parse(fileBuffer);

            const chunks = textChunkerService.chunk(extractedText);

            const persistedChunks = await documentsRepository.replaceChunks({
                documentId,
                chunks: chunks.map((chunk) => ({
                    chunkIndex: chunk.index,
                    content: chunk.content,
                })),
            });

            if (persistedChunks.length > 0) {
                const embeddings = await documentEmbeddingsService.generateEmbeddings(
                    persistedChunks.map((chunk) => chunk.content)
                );

                await documentVectorStoreService.upsertDocumentChunks({
                    chunks: persistedChunks.map((chunk, index) => {
                        const vectorId = buildChunkVectorId(documentId, chunk.chunkIndex);

                        return {
                            id: vectorId,
                            content: chunk.content,
                            embedding: embeddings[index],
                            metadata: {
                                userId: document.userId,
                                documentId,
                                chunkId: chunk.id,
                                chunkIndex: chunk.chunkIndex,
                                filename: document.filename,
                            },
                        };
                    }),
                });

                await documentsRepository.updateChunkVectorIds(
                    persistedChunks.map((chunk) => ({
                        id: chunk.id,
                        vectorId: buildChunkVectorId(documentId, chunk.chunkIndex),
                    }))
                );
            }

            await documentsRepository.updateStatus({
                documentId,
                status: DocumentStatus.READY,
                errorMessage: null,
                chunkCount: chunks.length,
                processedAt: new Date(),
            });
        } catch (error) {
            await documentsRepository.updateStatus({
                documentId,
                status: DocumentStatus.FAILED,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
                processedAt: null,
            });

            throw error;
        }
    }
}

export const documentProcessingService = new DocumentProcessingService();