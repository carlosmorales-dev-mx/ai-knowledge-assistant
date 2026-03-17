"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocumentsRequest } from "../api/documents.api";

export function useDocuments() {
    return useQuery({
        queryKey: ["documents"],
        queryFn: getDocumentsRequest,
    });
}