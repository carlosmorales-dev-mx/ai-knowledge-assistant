"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSessionRequest } from "@/features/sessions/api/sessions.api";
import type { ChatSession } from "@/features/sessions/types/sessions.types";

export function useDeleteSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionId: string) => {
            return deleteSessionRequest(sessionId);
        },
        onSuccess: (_response, sessionId) => {
            queryClient.setQueryData(
                ["chat-sessions"],
                (oldData: { data: ChatSession[] } | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter((session) => session.id !== sessionId),
                    };
                }
            );

            queryClient.removeQueries({
                queryKey: ["session-messages", sessionId],
            });
        },
    });
}