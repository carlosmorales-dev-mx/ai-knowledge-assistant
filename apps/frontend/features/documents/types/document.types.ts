export type Document = {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    status: "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
    chunkCount: number;
    processedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type DocumentsResponse = {
    data: Document[];
};