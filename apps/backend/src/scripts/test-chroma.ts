import { documentEmbeddingsService } from "../modules/documents/document-embeddings.service.js";
import { documentVectorStoreService } from "../modules/documents/document-vector-store.service.js";

async function main() {
    const content = "Este es un chunk de prueba para guardar en ChromaDB.";
    const embedding = await documentEmbeddingsService.generateEmbedding(content);

    await documentVectorStoreService.upsertDocumentChunk({
        id: "test-chunk-1",
        content,
        embedding,
        metadata: {
            userId: "test-user",
            documentId: "test-document",
            chunkId: "test-chunk-1",
            chunkIndex: 0,
            filename: "test.pdf",
        },
    });

    console.log("Chunk saved in Chroma successfully");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});