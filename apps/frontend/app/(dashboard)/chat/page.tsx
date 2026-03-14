"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/storage";
import { ChatShell } from "@/components/chat/chat-shell";

export default function ChatPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
        }
    }, [router]);

    return <ChatShell />;
}