"use client";

import { useMutation } from "@tanstack/react-query";
import { sendChatMessageRequest } from "@/features/chat/api/chat.api";
import { SendChatMessageRequest } from "@/features/chat/types/chat.types";

export function useSendChatMessage() {
    return useMutation({
        mutationFn: async (data: SendChatMessageRequest) => {
            return await sendChatMessageRequest(data);
        },
    });
}