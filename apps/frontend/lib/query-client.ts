import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: 0,
                gcTime: 1000 * 60 * 5,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}