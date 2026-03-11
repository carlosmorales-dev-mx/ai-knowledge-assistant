import { documentVectorStoreService } from "../modules/documents/document-vector-store.service.js";

async function main() {
    const result = await documentVectorStoreService.listStoredChunks(10);
    console.dir(result, { depth: null });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});