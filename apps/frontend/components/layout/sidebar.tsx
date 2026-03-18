"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useChatSessions } from "@/features/sessions/hooks/use-chat-sessions";
import { useChatSessionStore } from "@/stores/chat-session.store";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useRenameSession } from "@/features/sessions/hooks/use-rename-session";
import { useDeleteSession } from "@/features/sessions/hooks/use-delete-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ──────────────────────────────────────────────
   ICONS — inline SVGs, zero dependencies
   ────────────────────────────────────────────── */

const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 3v12M3 9h12" />
    </svg>
);

const IconChat = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const IconDocs = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const IconPencil = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

const IconTrash = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

/* ──────────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────────── */

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

    const sessions = useMemo(() => data?.data ?? [], [data?.data]);

    /* ── Handlers ── */

    function handleLogout() {
        logout();
        setActiveSessionId(undefined);
        addToast({ type: "success", title: "Logged out", description: "See you soon." });
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
            addToast({ type: "error", title: "Invalid title", description: "Session title cannot be empty" });
            return;
        }
        try {
            await renameSessionMutation.mutateAsync({ sessionId, title: trimmed });
            setEditingSessionId(null);
            setDraftTitle("");
            addToast({ type: "success", title: "Session renamed", description: "The session title was updated" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to rename session";
            addToast({ type: "error", title: "Rename failed", description: message });
        }
    }

    async function handleDeleteSession(sessionId: string) {
        const confirmed = window.confirm("Are you sure you want to delete this chat session?");
        if (!confirmed) return;
        try {
            await deleteSessionMutation.mutateAsync(sessionId);
            if (activeSessionId === sessionId) {
                setActiveSessionId(undefined);
                router.push("/chat");
            }
            addToast({ type: "success", title: "Session deleted", description: "The chat session was removed" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete session";
            addToast({ type: "error", title: "Delete failed", description: message });
        }
    }

    /* ── Render ── */

    return (
        <aside className="group/sidebar flex h-full w-[300px] shrink-0 flex-col overflow-hidden border-r border-[#e8edf4] bg-[#fafbfd]">
            {/* ━━━━━ HEADER ━━━━━ */}
            <div className="relative px-5 pb-5 pt-6">
                {/* Decorative gradient line at top */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#0066ff] via-[#00c896] to-transparent" />

                <div className="flex items-center gap-3.5">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a0a0a] text-[13px] font-bold tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                        AI
                        {/* Live indicator dot */}
                        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00c896] opacity-40" />
                            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#fafbfd] bg-[#00c896]" />
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-[15px] font-semibold tracking-[-0.03em] text-[#0a0a0a]">
                            AI Assistant
                        </h1>
                        <p className="text-[11px] font-medium tracking-wide text-[#94a0b8]">
                            Knowledge workspace
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleNewChat}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#0a0a0a] text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] active:scale-[0.98]"
                >
                    <IconPlus />
                    New Chat
                </button>
            </div>

            {/* ━━━━━ NAVIGATION ━━━━━ */}
            <div className="px-4 pb-1">
                <nav className="grid gap-1">
                    <SidebarLink href="/chat" label="Chat" icon={<IconChat />} active={pathname === "/chat"} />
                    <SidebarLink href="/documents" label="Documents" icon={<IconDocs />} active={pathname === "/documents"} />
                </nav>
            </div>

            {/* ━━━━━ DIVIDER ━━━━━ */}
            <div className="mx-5 my-3 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent" />

            {/* ━━━━━ RECENT CHATS HEADER ━━━━━ */}
            <div className="flex items-center justify-between px-5 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a0b8]">
                    Recent chats
                </p>

                {!isLoading && sessions.length > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-[#0066ff]/8 px-1.5 text-[10px] font-bold tabular-nums text-[#0066ff]">
                        {sessions.length}
                    </span>
                )}
            </div>

            {/* ━━━━━ SESSION LIST ━━━━━ */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
                <div className="space-y-1">
                    {isLoading && (
                        <>
                            <SessionSkeleton />
                            <SessionSkeleton />
                            <SessionSkeleton />
                        </>
                    )}

                    {isError && (
                        <div className="rounded-xl border border-red-200/60 bg-red-50/60 px-4 py-3 text-[13px] leading-relaxed text-red-600">
                            Failed to load sessions.
                        </div>
                    )}

                    {!isLoading && !isError && sessions.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[#dde3ee] bg-white/60 px-4 py-5 text-center text-[13px] leading-6 text-[#94a0b8]">
                            Your recent conversations
                            <br />
                            will appear here.
                        </div>
                    )}

                    {sessions.map((session) => {
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
                                className={`group/item rounded-xl border transition-all duration-200 ${isActive
                                    ? "border-[#0066ff]/15 bg-white shadow-[0_2px_12px_rgba(0,102,255,0.06)]"
                                    : "border-transparent hover:border-[#e8edf4] hover:bg-white/80"
                                    }`}
                            >
                                {isEditing ? (
                                    <div className="space-y-2.5 p-3">
                                        <Input
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
                                            autoFocus
                                            disabled={isRenaming}
                                            className="h-9 rounded-lg border-[#dde3ee] bg-white text-[13px] focus:border-[#0066ff] focus:ring-[#0066ff]/20"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => submitRename(session.id)}
                                                disabled={isRenaming}
                                                className="h-8 rounded-lg bg-[#0a0a0a] px-3.5 text-[12px] font-semibold text-white transition hover:bg-[#1a1a1a] disabled:opacity-50"
                                            >
                                                {isRenaming ? "Saving…" : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingSessionId(null);
                                                    setDraftTitle("");
                                                }}
                                                disabled={isRenaming}
                                                className="h-8 rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-[12px] font-medium text-[#64748b] transition hover:bg-[#f8fafc] disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            setActiveSessionId(session.id);
                                            router.push("/chat");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setActiveSessionId(session.id);
                                                router.push("/chat");
                                            }
                                        }}
                                        className="w-full cursor-pointer px-3 py-2.5 text-left"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Active indicator */}
                                            <div className="mt-[7px] flex h-2 w-2 shrink-0 items-center justify-center">
                                                {isActive ? (
                                                    <span className="h-2 w-2 rounded-full bg-[#00c896] shadow-[0_0_6px_rgba(0,200,150,0.4)]" />
                                                ) : (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#d0d7e3] transition-colors group-hover/item:bg-[#94a0b8]" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className={`line-clamp-2 text-[13px] font-medium leading-[1.5] ${isActive ? "text-[#0a0a0a]" : "text-[#3a3f4b]"
                                                    }`}>
                                                    {session.title || "Untitled chat"}
                                                </p>

                                                <div className="mt-1.5 flex items-center justify-between">
                                                    <span className="text-[10px] font-medium tracking-wide text-[#b0b8c8]">
                                                        Conversation
                                                    </span>

                                                    {/* Action buttons — visible on hover */}
                                                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/item:opacity-100">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startRename(session.id, session.title);
                                                            }}
                                                            disabled={isDeleting}
                                                            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94a0b8] transition hover:bg-[#0066ff]/8 hover:text-[#0066ff] disabled:pointer-events-none disabled:opacity-40"
                                                            title="Rename"
                                                        >
                                                            <IconPencil />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                void handleDeleteSession(session.id);
                                                            }}
                                                            disabled={isDeleting}
                                                            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94a0b8] transition hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-40"
                                                            title="Delete"
                                                        >
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ━━━━━ USER FOOTER ━━━━━ */}
            <div className="border-t border-[#e8edf4] px-4 py-4">
                {user ? (
                    <div className="rounded-xl border border-[#e8edf4] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00c896] text-[12px] font-bold tracking-wide text-white shadow-[0_2px_10px_rgba(0,102,255,0.2)]">
                                {getInitials(user.fullName)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-semibold text-[#0a0a0a]">
                                    {user.fullName}
                                </p>
                                <p className="truncate text-[11px] text-[#94a0b8]">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#e8edf4] bg-[#fafbfd] text-[12px] font-medium text-[#64748b] transition-all duration-200 hover:border-[#d0d7e3] hover:bg-[#f1f5f9] hover:text-[#0a0a0a] active:scale-[0.98]"
                        >
                            <IconLogout />
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e8edf4] bg-white text-[13px] font-medium text-[#64748b] transition hover:bg-[#f8fafc]"
                    >
                        <IconLogout />
                        Logout
                    </button>
                )}
            </div>
        </aside>
    );
}

/* ──────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────── */

function SidebarLink({
    href,
    label,
    icon,
    active,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-all duration-200 ${active
                ? "bg-white text-[#0a0a0a] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                : "text-[#64748b] hover:bg-white/60 hover:text-[#0a0a0a]"
                }`}
        >
            <span className={active ? "text-[#0066ff]" : "text-[#94a0b8]"}>
                {icon}
            </span>
            {label}
            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00c896]" />
            )}
        </Link>
    );
}

function SessionSkeleton() {
    return (
        <div className="animate-pulse rounded-xl border border-[#eef1f6] bg-white px-3 py-3">
            <div className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-[#e8edf4]" />
                <div className="flex-1 space-y-2.5">
                    <div className="h-3.5 w-3/4 rounded-md bg-[#eef1f6]" />
                    <div className="h-2.5 w-1/3 rounded-md bg-[#f4f6f9]" />
                </div>
            </div>
        </div>
    );
}

function getInitials(name?: string) {
    if (!name) return "AI";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "AI";
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}