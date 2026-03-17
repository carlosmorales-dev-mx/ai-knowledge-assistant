"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useChatSessions } from "@/features/sessions/hooks/use-chat-sessions";
import { useChatSessionStore } from "@/stores/chat-session.store";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useRenameSession } from "@/features/sessions/hooks/use-rename-session";
import { useDeleteSession } from "@/features/sessions/hooks/use-delete-session";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const { data, isLoading, isError } = useChatSessions();
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const addToast = useToastStore((state) => state.addToast);

    const renameSessionMutation = useRenameSession();
    const deleteSessionMutation = useDeleteSession();

    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [draftTitle, setDraftTitle] = useState("");

    function handleLogout() {
        logout();
        setActiveSessionId(undefined);

        addToast({
            type: "success",
            title: "Logged out",
            description: "See you soon 👋",
        });

        router.replace("/login");
    }

    function handleNewChat() {
        setActiveSessionId(undefined);
        router.push("/chat");
    }

    function startRename(sessionId: string, currentTitle: string | null) {
        setEditingSessionId(sessionId);
        setDraftTitle(currentTitle || "");
    }

    async function submitRename(sessionId: string) {
        const trimmed = draftTitle.trim();

        if (!trimmed) {
            addToast({
                type: "error",
                title: "Invalid title",
                description: "Session title cannot be empty",
            });
            return;
        }

        try {
            await renameSessionMutation.mutateAsync({
                sessionId,
                title: trimmed,
            });

            setEditingSessionId(null);
            setDraftTitle("");

            addToast({
                type: "success",
                title: "Session renamed",
                description: "The session title was updated",
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to rename session";

            addToast({
                type: "error",
                title: "Rename failed",
                description: message,
            });
        }
    }

    async function handleDeleteSession(sessionId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this chat session?"
        );

        if (!confirmed) return;

        try {
            await deleteSessionMutation.mutateAsync(sessionId);

            if (activeSessionId === sessionId) {
                setActiveSessionId(undefined);
                router.push("/chat");
            }

            addToast({
                type: "success",
                title: "Session deleted",
                description: "The chat session was removed",
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to delete session";

            addToast({
                type: "error",
                title: "Delete failed",
                description: message,
            });
        }
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
                    const isEditing = editingSessionId === session.id;
                    const isRenaming =
                        renameSessionMutation.isPending &&
                        renameSessionMutation.variables?.sessionId === session.id;
                    const isDeleting =
                        deleteSessionMutation.isPending &&
                        deleteSessionMutation.variables === session.id;

                    return (
                        <div
                            key={session.id}
                            className={`rounded-2xl border px-4 py-3 transition ${isActive
                                    ? "border-ai-border bg-ai-surface-soft shadow-sm"
                                    : "border-transparent bg-transparent hover:border-ai-border hover:bg-ai-surface-soft/70"
                                }`}
                        >
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        value={draftTitle}
                                        onChange={(e) => setDraftTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                void submitRename(session.id);
                                            }

                                            if (e.key === "Escape") {
                                                setEditingSessionId(null);
                                                setDraftTitle("");
                                            }
                                        }}
                                        className="w-full rounded-xl border border-ai-border bg-ai-bg px-3 py-2 text-sm text-ai-text outline-none"
                                        autoFocus
                                        disabled={isRenaming}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => submitRename(session.id)}
                                            disabled={isRenaming}
                                            className="rounded-xl bg-ai-dark px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isRenaming ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingSessionId(null);
                                                setDraftTitle("");
                                            }}
                                            disabled={isRenaming}
                                            className="rounded-xl border border-ai-border px-3 py-1.5 text-xs font-medium text-ai-text disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setActiveSessionId(session.id);
                                            router.push("/chat");
                                        }}
                                        className="w-full text-left"
                                    >
                                        <div className="line-clamp-2 text-sm font-medium text-ai-text">
                                            {session.title || "Untitled session"}
                                        </div>
                                    </button>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startRename(session.id, session.title)}
                                            disabled={isDeleting}
                                            className="text-xs font-medium text-ai-text-muted hover:text-ai-text disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Rename
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSession(session.id)}
                                            disabled={isDeleting}
                                            className="text-xs font-medium text-ai-danger disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
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