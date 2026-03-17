"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocumentRequest } from "../api/documents.api";

export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadDocumentRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
        onError: (error) => {
            console.error("Upload failed:", error);
        },
    });
}