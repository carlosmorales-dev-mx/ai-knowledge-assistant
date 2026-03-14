"use client";

import { useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import {
    ChatMessages,
    ChatMessageItem,
} from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";
import { useSessionMessages } from "@/features/sessions/hooks/use-sessions-messages";
import { useChatSessionStore } from "@/stores/chat-session.store";

export function ChatShell() {
    const { activeSessionId, setActiveSessionId } = useChatSessionStore();
    const [messages, setMessages] = useState<ChatMessageItem[]>([]);

    const sendMessageMutation = useSendChatMessage();
    const sessionMessagesQuery = useSessionMessages(activeSessionId);

    useEffect(() => {
        if (!activeSessionId) {
            setMessages([]);
            return;
        }

        if (!sessionMessagesQuery.data?.data) {
            return;
        }

        const mappedMessages: ChatMessageItem[] = sessionMessagesQuery.data.data.map(
            (message) => ({
                id: message.id,
                role: message.role === "USER" ? "user" : "assistant",
                content: message.content,
            })
        );

        setMessages(mappedMessages);
    }, [activeSessionId, sessionMessagesQuery.data]);

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

            const assistantContent =
                backendData.answer ??
                backendData.fallback ??
                "No response received from assistant.";

            const assistantMessage: ChatMessageItem = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: assistantContent,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            const fallbackMessage: ChatMessageItem = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "There was an error sending your message.",
            };

            setMessages((prev) => [...prev, fallbackMessage]);
        }
    }

    const showEmptyState = messages.length === 0 && !sessionMessagesQuery.isLoading;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <ChatHeader title="AI Knowledge Assistant" />

            {sessionMessagesQuery.isLoading ? (
                <div style={{ padding: "20px" }}>Loading messages...</div>
            ) : showEmptyState ? (
                <ChatEmptyState />
            ) : (
                <ChatMessages messages={messages} />
            )}

            <ChatInput
                onSendMessage={handleSendMessage}
                isSending={sendMessageMutation.isPending}
            />
        </div>
    );
}