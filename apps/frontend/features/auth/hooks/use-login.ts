"use client";

import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth.api";
import { LoginRequest } from "../types/auth.types";
import { setAccessToken } from "@/lib/storage";

export function useLogin() {
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await loginRequest(data);

            const accessToken = response.data.accessToken;

            if (!accessToken) {
                throw new Error("Login response does not include an access token");
            }

            setAccessToken(accessToken);

            return response;
        },
    });
}