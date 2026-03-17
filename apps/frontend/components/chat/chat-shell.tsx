"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import {
    ChatMessages,
    ChatMessageItem,
} from "@/components/chat/chat-messages";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";
import { useSessionMessages } from "@/features/sessions/hooks/use-sessions-messages";
import { useChatSessionStore } from "@/stores/chat-session.store";
import { Card } from "@/components/ui/card";

export function ChatShell() {
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const sendMessageMutation = useSendChatMessage();
    const sessionMessagesQuery = useSessionMessages(activeSessionId);

    useEffect(() => {
        if (!activeSessionId) {
            setMessages([]);
            return;
        }

        if (!sessionMessagesQuery.data?.data) return;

        const mappedMessages: ChatMessageItem[] =
            sessionMessagesQuery.data.data.map((message) => ({
                id: message.id,
                role: message.role === "USER" ? "user" : "assistant",
                content: message.content,
            }));

        setMessages(mappedMessages);
    }, [activeSessionId, sessionMessagesQuery.data]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sendMessageMutation.isPending]);

    async function handleSendMessage(message: string) {
        const userMessage: ChatMessageItem = {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await sendMessageMutation.mutateAsync({
                message,
                sessionId: activeSessionId,
            });

            const backendData = response.data;

            if (backendData.sessionId && !activeSessionId) {
                setActiveSessionId(backendData.sessionId);
            }

            const assistantMessage: ChatMessageItem = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    backendData.answer ??
                    backendData.fallback ??
                    "No response received.",
                sources: backendData.sources ?? [],
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "There was an error sending your message.",
                },
            ]);
        }
    }

    const showEmpty =
        messages.length === 0 && !sessionMessagesQuery.isLoading;

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-ai-border bg-ai-bg px-8 py-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-2xl font-semibold tracking-tight text-ai-text">
                        AI Knowledge Assistant
                    </h1>
                    <p className="mt-1 text-sm text-ai-text-muted">
                        Ask questions about your uploaded documents.
                    </p>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
                    {sessionMessagesQuery.isLoading ? (
                        <div className="mx-auto flex max-w-4xl justify-center">
                            <Card className="px-5 py-4 text-sm text-ai-text-muted">
                                Loading messages...
                            </Card>
                        </div>
                    ) : showEmpty ? (
                        <div className="mx-auto flex max-w-4xl flex-col items-center pt-20 text-center">
                            <div className="mb-5 inline-flex items-center rounded-full border border-ai-border bg-ai-surface px-4 py-2 text-xs font-medium text-ai-text-muted">
                                Knowledge-aware conversation
                            </div>

                            <h2 className="max-w-2xl text-5xl font-semibold tracking-tight text-ai-text">
                                Welcome back
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-8 text-ai-text-muted">
                                Ask about your PDFs and the assistant will retrieve relevant
                                chunks, build context, and answer using your document knowledge base.
                            </p>
                        </div>
                    ) : (
                        <ChatMessages messages={messages} />
                    )}

                    {sendMessageMutation.isPending && (
                        <div className="mx-auto mt-4 max-w-4xl">
                            <Card className="inline-flex px-4 py-3 text-sm text-ai-text-muted">
                                Thinking...
                            </Card>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div className="border-t border-ai-border bg-ai-bg px-6 py-8">
                    <div className="mx-auto max-w-4xl">
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