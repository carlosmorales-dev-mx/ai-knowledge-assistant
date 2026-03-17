"use client";

import { create } from "zustand";
import { getMeRequest } from "@/features/auth/api/auth.api";
import { getAccessToken, removeAccessToken, setAccessToken } from "@/lib/storage";
import type { AuthUser } from "@/features/auth/types/auth.types";

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    hasBootstrapped: boolean;
    setSession: (user: AuthUser, accessToken: string) => void;
    clearSession: () => void;
    bootstrapAuth: () => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isBootstrapping: false,
    hasBootstrapped: false,

    setSession: (user, accessToken) => {
        setAccessToken(accessToken);

        set({
            user,
            accessToken,
            isAuthenticated: true,
            isBootstrapping: false,
            hasBootstrapped: true,
        });
    },

    clearSession: () => {
        removeAccessToken();

        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isBootstrapping: false,
            hasBootstrapped: true,
        });
    },

    bootstrapAuth: async () => {
        const token = getAccessToken();

        if (!token) {
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isBootstrapping: false,
                hasBootstrapped: true,
            });
            return;
        }

        set({
            isBootstrapping: true,
        });

        try {
            const user = await getMeRequest();

            set({
                user,
                accessToken: token,
                isAuthenticated: true,
                isBootstrapping: false,
                hasBootstrapped: true,
            });
        } catch {
            removeAccessToken();

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isBootstrapping: false,
                hasBootstrapped: true,
            });
        }
    },

    logout: () => {
        removeAccessToken();

        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isBootstrapping: false,
            hasBootstrapped: true,
        });
    },
}));