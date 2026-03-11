import { env } from "../../config/env.js";
import { supabase } from "../../lib/supabase.js";
import { AppError } from "../../shared/errors/app-error.js";

export class DocumentStorageService {
    async upload(params: {
        storagePath: string;
        fileBuffer: Buffer;
        mimeType: string;
    }): Promise<void> {
        const { storagePath, fileBuffer, mimeType } = params;

        const { error } = await supabase.storage
            .from(env.SUPABASE_STORAGE_BUCKET)
            .upload(storagePath, fileBuffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            throw new AppError("Failed to upload document to storage", 500, {
                storagePath,
                cause: error.message,
            });
        }
    }

    async download(storagePath: string): Promise<Buffer> {
        const { data, error } = await supabase.storage
            .from(env.SUPABASE_STORAGE_BUCKET)
            .download(storagePath);

        if (error || !data) {
            throw new AppError("Failed to download document from storage", 500, {
                storagePath,
                cause: error?.message ?? "unknown",
            });
        }

        const arrayBuffer = await data.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}

export const documentStorageService = new DocumentStorageService();