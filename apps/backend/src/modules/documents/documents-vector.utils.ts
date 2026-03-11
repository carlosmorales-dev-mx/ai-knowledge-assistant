export function buildChunkVectorId(documentId: string, chunkIndex: number) {
    return `${documentId}_${chunkIndex}`;
}