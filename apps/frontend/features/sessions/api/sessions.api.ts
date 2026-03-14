import { apiClient, toApiClientError } from "@/lib/api-client";
import {
    GetChatSessionsResponse,
    GetSessionMessagesResponse,
} from "@/features/sessions/types/sessions.types";

export async function getChatSessionsRequest(): Promise<GetChatSessionsResponse> {
    try {
        const response = await apiClient.get<GetChatSessionsResponse>("/chat/sessions");
        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}

export async function getSessionMessagesRequest(
    sessionId: string,
    page = 1,
    pageSize = 20
): Promise<GetSessionMessagesResponse> {
    try {
        const response = await apiClient.get<GetSessionMessagesResponse>(
            `/chat/sessions/${sessionId}/messages`,
            {
                params: { page, pageSize },
            }
        );

        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}