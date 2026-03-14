"use client";

import { useState } from "react";

type ChatInputProps = {
    onSendMessage: (message: string) => void;
    isSending?: boolean;
};

export function ChatInput({
    onSendMessage,
    isSending = false,
}: ChatInputProps) {
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || isSending) return;

        onSendMessage(trimmedMessage);
        setMessage("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                borderTop: "1px solid #222",
                padding: "16px 20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                }}
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about your documents..."
                    style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #333",
                        background: "#111",
                        color: "white",
                    }}
                />

                <button
                    type="submit"
                    disabled={isSending}
                    style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid #333",
                        background: "#1f1f1f",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {isSending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}