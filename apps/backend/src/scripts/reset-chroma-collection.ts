import { ChromaClient } from "chromadb";
import { env } from "../config/env.js";

async function main() {
    const client = new ChromaClient({
        path: env.CHROMA_URL,
    });

    try {
        await client.deleteCollection({
            name: env.CHROMA_COLLECTION_NAME,
        });
        console.log(`Deleted collection: ${env.CHROMA_COLLECTION_NAME}`);
    } catch (error) {
        console.log("Collection did not exist or could not be deleted safely");
    }

    await client.getOrCreateCollection({
        name: env.CHROMA_COLLECTION_NAME,
        metadata: {
            description: "Document chunks for AI Knowledge Assistant",
        },
        embeddingFunction: null,
    });

    console.log(`Created collection: ${env.CHROMA_COLLECTION_NAME}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});