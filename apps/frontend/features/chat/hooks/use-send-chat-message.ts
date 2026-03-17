"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessageRequest } from "@/features/chat/api/chat.api";
import { SendChatMessageRequest } from "@/features/chat/types/chat.types";

export function useSendChatMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SendChatMessageRequest) => {
            return await sendChatMessageRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        },
    });
}