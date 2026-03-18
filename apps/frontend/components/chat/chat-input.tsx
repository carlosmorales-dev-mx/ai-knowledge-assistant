"use client";

import { useEffect, useRef, useState } from "react";

type ChatInputProps = {
    onSendMessage: (message: string) => void;
    isSending?: boolean;
};

export function ChatInput({
    onSendMessage,
    isSending = false,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "0px";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }, [message]);

    function submitCurrentMessage() {
        const trimmed = message.trim();
        if (!trimmed || isSending) return;
        onSendMessage(trimmed);
        setMessage("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submitCurrentMessage();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitCurrentMessage();
        }
    }

    const disabled = isSending || !message.trim();

    return (
        <form onSubmit={handleSubmit}>
            <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-200 focus-within:border-[#0066ff]/30 focus-within:shadow-[0_8px_32px_rgba(0,102,255,0.08)]">
                {/* Top accent line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#0066ff] via-[#00c896] to-transparent opacity-0 transition-opacity duration-200 group-focus-within:opacity-100" />

                <div className="relative flex items-end gap-3 p-3 sm:p-3.5">
                    <div className="flex-1">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your documents..."
                            rows={1}
                            className="min-h-[56px] max-h-[220px] w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-7 text-[#0a0a0a] outline-none placeholder:font-medium placeholder:text-[#94a0b8]"
                        />

                        <div className="flex items-center justify-between px-3 pb-1 pt-0.5">
                            <div className="flex items-center gap-2 text-[11px] text-[#94a0b8]">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00c896]" />
                                Retrieval-ready
                            </div>
                            <p className="text-[11px] text-[#b0b8c8]">
                                Enter to send · Shift + Enter for new line
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={disabled}
                        className={`inline-flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200 ${disabled
                                ? "cursor-not-allowed border border-[#e8edf4] bg-[#f4f6f9] text-[#b0b8c8]"
                                : "bg-[#0a0a0a] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#1a1a1a] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] active:scale-[0.98]"
                            }`}
                    >
                        {isSending ? (
                            <>
                                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="32" strokeDashoffset="8" strokeLinecap="round" />
                                </svg>
                                Sending
                            </>
                        ) : (
                            <>
                                Send
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}