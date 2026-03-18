import { ChromaClient, type Collection } from "chromadb";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

type DocumentChunkVectorMetadata = {
    userId: string;
    documentId: string;
    chunkId: string;
    chunkIndex: number;
    filename: string;
};

export class DocumentVectorStoreService {
    private readonly client: ChromaClient;
    private collection: Collection | null = null;

    constructor() {
        const chromaUrl = new URL(env.CHROMA_URL);

        this.client = new ChromaClient({
            host: chromaUrl.hostname,
            port: Number(
                chromaUrl.port || (chromaUrl.protocol === "https:" ? 443 : 80)
            ),
            ssl: chromaUrl.protocol === "https:",
        });
    }

    private async getCollection(): Promise<Collection> {
        if (this.collection) {
            return this.collection;
        }

        try {
            this.collection = await this.client.getOrCreateCollection({
                name: env.CHROMA_COLLECTION_NAME,
                metadata: {
                    description: "Document chunks for AI Knowledge Assistant",
                },
                embeddingFunction: null as never,
            });

            return this.collection;
        } catch (error) {
            throw new AppError("Failed to initialize Chroma collection", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async upsertDocumentChunk(input: {
        id: string;
        content: string;
        embedding: number[];
        metadata: DocumentChunkVectorMetadata;
    }) {
        const collection = await this.getCollection();

        try {
            await collection.upsert({
                ids: [input.id],
                documents: [input.content],
                embeddings: [input.embedding],
                metadatas: [input.metadata],
            });
        } catch (error) {
            throw new AppError("Failed to upsert chunk into Chroma", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async upsertDocumentChunks(input: {
        chunks: Array<{
            id: string;
            content: string;
            embedding: number[];
            metadata: DocumentChunkVectorMetadata;
        }>;
    }) {
        if (input.chunks.length === 0) {
            return;
        }

        const collection = await this.getCollection();

        try {
            await collection.upsert({
                ids: input.chunks.map((chunk) => chunk.id),
                documents: input.chunks.map((chunk) => chunk.content),
                embeddings: input.chunks.map((chunk) => chunk.embedding),
                metadatas: input.chunks.map((chunk) => chunk.metadata),
            });
        } catch (error) {
            throw new AppError("Failed to upsert chunks into Chroma", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async querySimilarChunks(input: {
        embedding: number[];
        userId: string;
        limit?: number;
    }) {
        const collection = await this.getCollection();
        const limit = input.limit ?? 5;

        try {
            const result = await collection.query({
                queryEmbeddings: [input.embedding],
                nResults: limit,
                where: {
                    userId: input.userId,
                },
            });

            return result;
        } catch (error) {
            throw new AppError("Failed to query similar chunks", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async listStoredChunks(limit = 10) {
        const collection = await this.getCollection();

        try {
            return await collection.get({
                limit,
                include: ["documents", "metadatas"],
            });
        } catch (error) {
            throw new AppError("Failed to list chunks from Chroma", 502, {
                cause: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}

export const documentVectorStoreService = new DocumentVectorStoreService();