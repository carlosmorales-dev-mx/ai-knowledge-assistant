"use client";

import { useQuery } from "@tanstack/react-query";
import { getSessionMessagesRequest } from "@/features/sessions/api/sessions.api";

export function useSessionMessages(sessionId?: string) {
    return useQuery({
        queryKey: ["session-messages", sessionId],
        queryFn: () => getSessionMessagesRequest(sessionId as string),
        enabled: !!sessionId,
        staleTime: 0,
    });
}