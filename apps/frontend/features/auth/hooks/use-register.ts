"use client";

import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth.api";
import { RegisterRequest } from "../types/auth.types";
import { useAuthStore } from "@/stores/auth.store";

export function useRegister() {
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            return await registerRequest(data);
        },
        onSuccess: (data) => {
            setSession(data.user, data.accessToken);
        },
    });
}