"use client";

import Link from "next/link";
import { removeAccessToken } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useChatSessions } from "@/features/sessions/hooks/use-chat-sessions";
import { useChatSessionStore } from "@/stores/chat-session.store";

export function Sidebar() {
    const router = useRouter();
    const { data, isLoading, isError } = useChatSessions();
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();

    function handleLogout() {
        removeAccessToken();
        router.push("/login");
    }

    function handleNewChat() {
        setActiveSessionId(undefined);
        router.push("/chat");
    }

    return (
        <aside
            style={{
                width: "260px",
                borderRight: "1px solid #222",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <h2>AI Assistant</h2>

            <button onClick={handleNewChat}>New Chat</button>

            <Link href="/chat">Chat</Link>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <strong>Sessions</strong>

                {isLoading && <p>Loading sessions...</p>}
                {isError && <p>Failed to load sessions.</p>}

                {data?.data?.map((session) => (
                    <button
                        key={session.id}
                        onClick={() => {
                            setActiveSessionId(session.id);
                            router.push("/chat");
                        }}
                        style={{
                            textAlign: "left",
                            padding: "10px",
                            borderRadius: "8px",
                            border:
                                activeSessionId === session.id
                                    ? "1px solid #666"
                                    : "1px solid #333",
                            background: activeSessionId === session.id ? "#1a1a1a" : "#111",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        {session.title || "Untitled session"}
                    </button>
                ))}
            </div>

            <button onClick={handleLogout}>Logout</button>
        </aside>
    );
}