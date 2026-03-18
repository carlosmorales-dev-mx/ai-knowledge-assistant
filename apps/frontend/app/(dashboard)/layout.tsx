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
                <div className="rounded-[28px] border border-ai-border bg-white px-6 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    Loading workspace...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-ai-bg">
            <Sidebar />

            <main className="relative min-w-0 flex-1 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[18%] top-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
                    <div className="absolute right-[10%] top-[12%] h-64 w-64 rounded-full bg-sky-100/30 blur-3xl" />
                    <div className="absolute bottom-[8%] left-[35%] h-72 w-72 rounded-full bg-violet-100/40 blur-3xl" />
                </div>

                <div className="relative h-full min-h-0">{children}</div>
            </main>
        </div>
    );
}