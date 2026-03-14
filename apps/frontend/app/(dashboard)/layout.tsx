"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    padding: "20px",
                    overflow: "auto",
                }}
            >
                {children}
            </main>
        </div>
    );
}