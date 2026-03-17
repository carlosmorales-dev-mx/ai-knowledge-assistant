"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameSessionRequest } from "@/features/sessions/api/sessions.api";
import type { ChatSession } from "@/features/sessions/types/sessions.types";

export function useRenameSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            sessionId,
            title,
        }: {
            sessionId: string;
            title: string;
        }) => {
            return renameSessionRequest(sessionId, { title });
        },
        onSuccess: (response) => {
            queryClient.setQueryData(
                ["chat-sessions"],
                (oldData: { data: ChatSession[] } | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.map((session) =>
                            session.id === response.data.id ? response.data : session
                        ),
                    };
                }
            );
        },
    });
}