import { apiClient, toApiClientError } from "@/lib/api-client";
import {
    DeleteSessionResponse,
    GetChatSessionsResponse,
    GetSessionMessagesResponse,
    RenameSessionRequest,
    RenameSessionResponse,
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

export async function renameSessionRequest(
    sessionId: string,
    data: RenameSessionRequest
): Promise<RenameSessionResponse> {
    try {
        const response = await apiClient.patch<RenameSessionResponse>(
            `/chat/sessions/${sessionId}`,
            data
        );

        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}

export async function deleteSessionRequest(
    sessionId: string
): Promise<DeleteSessionResponse> {
    try {
        const response = await apiClient.delete<DeleteSessionResponse>(
            `/chat/sessions/${sessionId}`
        );

        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}