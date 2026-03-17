"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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

        const trimmed = message.trim();

        if (!trimmed || isSending) return;

        onSendMessage(trimmed);
        setMessage("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-[28px] border border-ai-border bg-ai-surface p-3 shadow-sm">
                <div className="flex items-end gap-3">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about your documents..."
                        rows={1}
                        className="max-h-40 min-h-[56px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-ai-text outline-none placeholder:text-ai-text-muted"
                    />

                    <Button type="submit" disabled={isSending} className="px-5 py-3">
                        {isSending ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </form>
    );
}