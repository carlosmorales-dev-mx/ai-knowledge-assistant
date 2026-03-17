import { apiClient, toApiClientError } from "@/lib/api-client";
import type {
    LoginRequest,
    LoginResponse,
    MeResponse,
    RegisterRequest,
    RegisterResponse,
    AuthUser,
    AuthPayload,
} from "../types/auth.types";

export async function loginRequest(data: LoginRequest): Promise<AuthPayload> {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", data);
        return response.data.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}

export async function registerRequest(data: RegisterRequest): Promise<AuthPayload> {
    try {
        const response = await apiClient.post<RegisterResponse>("/auth/register", data);
        return response.data.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}

export async function getMeRequest(): Promise<AuthUser> {
    try {
        const response = await apiClient.get<MeResponse>("/auth/me");
        return response.data.data;
    } catch (error) {
        throw toApiClientError(error);
    }
}