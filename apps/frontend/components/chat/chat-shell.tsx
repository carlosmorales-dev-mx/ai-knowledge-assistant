"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages, ChatMessageItem } from "@/components/chat/chat-messages";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";
import { useSessionMessages } from "@/features/sessions/hooks/use-sessions-messages";
import { useChatSessionStore } from "@/stores/chat-session.store";
import type { ChatSource } from "@/features/chat/types/chat.types";

type LocalChatMessage = ChatMessageItem & {
    pending?: boolean;
    error?: boolean;
};

export function ChatShell() {
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();
    const [messages, setMessages] = useState<LocalChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const sendMessageMutation = useSendChatMessage();
    const sessionMessagesQuery = useSessionMessages(activeSessionId);

    useEffect(() => {
        if (!activeSessionId) {
            setMessages([]);
            return;
        }

        if (!sessionMessagesQuery.data?.data) return;

        setMessages((prevMessages) => {
            const mappedMessages: LocalChatMessage[] =
                sessionMessagesQuery.data.data.map((message) => {
                    const mappedRole = message.role === "USER" ? "user" : "assistant";

                    const existingAssistantMessageWithSources =
                        mappedRole === "assistant"
                            ? prevMessages.find(
                                (prev) =>
                                    prev.role === "assistant" &&
                                    !prev.pending &&
                                    prev.content.trim() === message.content.trim() &&
                                    Array.isArray(prev.sources) &&
                                    prev.sources.length > 0
                            )
                            : undefined;

                    return {
                        id: message.id,
                        role: mappedRole,
                        content: message.content,
                        sources: existingAssistantMessageWithSources?.sources ?? [],
                        pending: false,
                        error: false,
                    };
                });

            return mappedMessages;
        });
    }, [activeSessionId, sessionMessagesQuery.data]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSendMessage(message: string) {
        const userMessage: LocalChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
            pending: false,
            error: false,
        };

        const pendingAssistantId = crypto.randomUUID();

        const pendingAssistantMessage: LocalChatMessage = {
            id: pendingAssistantId,
            role: "assistant",
            content: "",
            sources: [],
            pending: true,
            error: false,
        };

        setMessages((prev) => [...prev, userMessage, pendingAssistantMessage]);

        try {
            const response = await sendMessageMutation.mutateAsync({
                message,
                sessionId: activeSessionId,
            });

            const backendData = response.data;

            if (backendData.sessionId && !activeSessionId) {
                setActiveSessionId(backendData.sessionId);
            }

            const normalizedSources: ChatSource[] = Array.isArray(backendData.sources)
                ? backendData.sources.map((source) => ({
                    id: source.id,
                    documentId: source.documentId ?? null,
                    filename: source.filename ?? "Unknown document",
                    chunkIndex:
                        typeof source.chunkIndex === "number" ? source.chunkIndex : null,
                    content: source.content ?? "",
                    distance:
                        typeof source.distance === "number" ? source.distance : null,
                }))
                : [];

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === pendingAssistantId
                        ? {
                            ...msg,
                            content:
                                backendData.answer ??
                                backendData.fallback ??
                                "No response received.",
                            sources: normalizedSources,
                            pending: false,
                            error: false,
                        }
                        : msg
                )
            );
        } catch {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === pendingAssistantId
                        ? {
                            ...msg,
                            content: "There was an error sending your message.",
                            sources: [],
                            pending: false,
                            error: true,
                        }
                        : msg
                )
            );
        }
    }

    const hasRenderableMessages = messages.length > 0;
    const showEmpty =
        !hasRenderableMessages &&
        !sessionMessagesQuery.isLoading &&
        !sendMessageMutation.isPending;

    return (
        <div className="flex h-full min-h-0 flex-col bg-[#fafbfd]">
            <ChatHeader />

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 sm:px-6 sm:pt-5">
                    {sessionMessagesQuery.isLoading ? (
                        <div className="mx-auto flex max-w-5xl flex-col gap-4 py-6">
                            <LoadingMessageCard />
                            <LoadingMessageCard assistant />
                            <LoadingMessageCard />
                        </div>
                    ) : showEmpty ? (
                        <ChatEmptyState />
                    ) : (
                        <div className="py-4 sm:py-6">
                            <ChatMessages messages={messages} />
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-5">
                    <div className="mx-auto max-w-5xl">
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            isSending={sendMessageMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingMessageCard({ assistant = false }: { assistant?: boolean }) {
    return (
        <div className={`flex ${assistant ? "justify-start" : "justify-end"}`}>
            <div className={`w-full ${assistant ? "max-w-4xl" : "max-w-2xl"}`}>
                <div className="animate-pulse rounded-2xl border border-[#e8edf4] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                    <div className="space-y-3">
                        <div className="h-3.5 w-3/4 rounded-md bg-[#eef1f6]" />
                        <div className="h-3.5 w-full rounded-md bg-[#f4f6f9]" />
                        <div className="h-3.5 w-5/6 rounded-md bg-[#eef1f6]" />
                    </div>
                </div>
            </div>
        </div>
    );
}