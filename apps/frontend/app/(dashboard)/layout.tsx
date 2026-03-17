"use client";

import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

    useEffect(() => {
        if (hasBootstrapped && !isBootstrapping && !isAuthenticated) {
            router.replace("/login");
        }
    }, [hasBootstrapped, isBootstrapping, isAuthenticated, router]);

    if (!hasBootstrapped || isBootstrapping) {
        return (
            <div className="flex h-screen items-center justify-center bg-ai-bg text-ai-text">
                Loading workspace...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen bg-ai-bg text-ai-text">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
        </div>
    );
}