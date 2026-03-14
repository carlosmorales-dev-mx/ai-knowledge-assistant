"use client";

import { useQuery } from "@tanstack/react-query";
import { getChatSessionsRequest } from "@/features/sessions/api/sessions.api";

export function useChatSessions() {
    return useQuery({
        queryKey: ["chat-sessions"],
        queryFn: getChatSessionsRequest,
    });
}