import { apiClient, toApiClientError } from "@/lib/api-client";
import { LoginRequest, LoginResponse } from "../types/auth.types";

export async function loginRequest(
    data: LoginRequest
): Promise<LoginResponse> {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", data);
        return response.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}