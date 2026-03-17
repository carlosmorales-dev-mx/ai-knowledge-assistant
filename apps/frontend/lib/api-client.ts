import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/lib/env";
import { getAccessToken, removeAccessToken } from "@/lib/storage";
import { ApiClientError, ApiErrorResponse } from "@/types/api";

function createApiClient(): AxiosInstance {
    const client = axios.create({
        baseURL: env.apiUrl,
        headers: {
            "Content-Type": "application/json",
        },
    });

    client.interceptors.request.use((config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                if (typeof window !== "undefined") {
                    removeAccessToken();
                    window.location.href = "/login";
                }
            }

            return Promise.reject(error);
        }
    );

    return client;
}

export const apiClient = createApiClient();

export function toApiClientError(error: unknown): ApiClientError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const status = axiosError.response?.status ?? 500;

        const message =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            axiosError.message ||
            "Unexpected API error";

        const details = axiosError.response?.data?.details;

        return new ApiClientError(message, status, details);
    }

    if (error instanceof Error) {
        return new ApiClientError(error.message, 500);
    }

    return new ApiClientError("Unknown error", 500);
}