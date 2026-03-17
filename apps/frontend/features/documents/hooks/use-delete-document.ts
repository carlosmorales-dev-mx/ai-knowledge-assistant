"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocumentRequest } from "../api/documents.api";

export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDocumentRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
}