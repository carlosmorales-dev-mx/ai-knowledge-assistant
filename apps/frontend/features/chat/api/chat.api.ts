import { apiClient, toApiClientError } from "@/lib/api-client";
import {
    SendChatMessageRequest,
    SendChatMessageResponse,
} from "@/features/chat/types/chat.types";

export async function sendChatMessageRequest(
    data: SendChatMessageRequest
): Promise<SendChatMessageResponse> {
    try {
        const response = await apiClient.post<SendChatMessageResponse>("/chat", data);
        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}