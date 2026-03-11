import { documentEmbeddingsService } from "../modules/documents/document-embeddings.service.js";

async function main() {
    const embedding = await documentEmbeddingsService.generateEmbedding(
        "Hola, este es un texto de prueba para embeddings."
    );

    console.log("Embedding length:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});