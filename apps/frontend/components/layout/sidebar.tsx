"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChatSessions } from "@/features/sessions/hooks/use-chat-sessions";
import { useChatSessionStore } from "@/stores/chat-session.store";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const { data, isLoading, isError } = useChatSessions();
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    function handleLogout() {
        logout();
        setActiveSessionId(undefined);
        router.replace("/login");
    }

    function handleNewChat() {
        setActiveSessionId(undefined);
        router.push("/chat");
    }

    return (
        <aside className="flex w-[280px] shrink-0 flex-col border-r border-ai-border bg-ai-surface px-4 py-5">
            <div className="mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ai-dark text-sm font-semibold text-white">
                        AI
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-ai-text">
                            AI Assistant
                        </h1>
                        <p className="text-xs text-ai-text-muted">Retrieval workspace</p>
                    </div>
                </div>
            </div>

            {user && (
                <div className="mb-5 rounded-2xl border border-ai-border bg-ai-bg px-4 py-3">
                    <p className="truncate text-sm font-medium text-ai-text">{user.fullName}</p>
                    <p className="truncate text-xs text-ai-text-muted">{user.email}</p>
                </div>
            )}

            <Button onClick={handleNewChat} className="mb-5">
                New Chat
            </Button>

            <nav className="mb-6 space-y-1">
                <SidebarLink href="/chat" label="Chat" active={pathname === "/chat"} />
                <SidebarLink
                    href="/documents"
                    label="Documents"
                    active={pathname === "/documents"}
                />
            </nav>

            <div className="mb-3 px-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ai-text-muted">
                    Recent sessions
                </p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {isLoading && (
                    <p className="px-2 text-sm text-ai-text-muted">Loading sessions...</p>
                )}

                {isError && (
                    <p className="px-2 text-sm text-ai-danger">Failed to load sessions.</p>
                )}

                {data?.data?.map((session) => {
                    const isActive = activeSessionId === session.id;

                    return (
                        <button
                            key={session.id}
                            onClick={() => {
                                setActiveSessionId(session.id);
                                router.push("/chat");
                            }}
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${isActive
                                    ? "border-ai-border bg-ai-surface-soft shadow-sm"
                                    : "border-transparent bg-transparent hover:border-ai-border hover:bg-ai-surface-soft/70"
                                }`}
                        >
                            <div className="line-clamp-2 text-sm font-medium text-ai-text">
                                {session.title || "Untitled session"}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 border-t border-ai-border pt-4">
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                    Logout
                </Button>
            </div>
        </aside>
    );
}

function SidebarLink({
    href,
    label,
    active,
}: {
    href: string;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                    ? "bg-ai-surface-soft text-ai-text"
                    : "text-ai-text-muted hover:bg-ai-surface-soft hover:text-ai-text"
                }`}
        >
            {label}
        </Link>
    );
}