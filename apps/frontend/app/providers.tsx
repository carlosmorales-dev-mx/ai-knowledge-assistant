"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { makeQueryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth.store";
import { ToastContainer } from "@/components/ui/toast";

type ProvidersProps = {
    children: React.ReactNode;
};

function AuthBootstrap() {
    const bootstrapAuth = useAuthStore((state) => state.bootstrapAuth);

    useEffect(() => {
        bootstrapAuth();
    }, [bootstrapAuth]);

    return null;
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => makeQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthBootstrap />
            {children}
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}