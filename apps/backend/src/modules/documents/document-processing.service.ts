import { DocumentStatus } from "@prisma/client";
import { documentsRepository } from "./documents.repository.js";
import { documentStorageService } from "./document-storage.service.js";
import { pdfParserService } from "./pdf-parser.service.js";
import { textChunkerService } from "./text-chunker.service.js";

export class DocumentProcessingService {
    async process(documentId: string): Promise<void> {
        try {
            await documentsRepository.updateStatus({
                documentId,
                status: DocumentStatus.PROCESSING,
                errorMessage: null,
            });

            const document = await documentsRepository.findStoragePathById(documentId);

            if (!document) {
                throw new Error("Document not found during processing");
            }

            const fileBuffer = await documentStorageService.download(
                document.storagePath
            );

            const extractedText = await pdfParserService.parse(fileBuffer);

            const chunks = textChunkerService.chunk(extractedText);

            await documentsRepository.replaceChunks({
                documentId,
                chunks: chunks.map((chunk) => ({
                    chunkIndex: chunk.index,
                    content: chunk.content,
                })),
            });

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