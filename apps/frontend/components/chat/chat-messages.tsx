"use client";

import { Card } from "@/components/ui/card";
import type { ChatSource } from "@/features/chat/types/chat.types";

export type ChatMessageItem = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: ChatSource[];
    pending?: boolean;
    error?: boolean;
};

type ChatMessagesProps = {
    messages: ChatMessageItem[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
    if (messages.length === 0) return null;

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            {messages.map((message) => (
                <MessageRow key={message.id} message={message} />
            ))}
        </div>
    );
}

function MessageRow({ message }: { message: ChatMessageItem }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`w-full ${isUser ? "max-w-2xl" : "max-w-4xl"}`}>
                {isUser ? (
                    <UserMessage content={message.content} />
                ) : (
                    <AssistantMessage
                        content={message.content}
                        sources={message.sources}
                        pending={message.pending}
                        error={message.error}
                    />
                )}
            </div>
        </div>
    );
}

function UserMessage({ content }: { content: string }) {
    return (
        <div className="flex flex-col items-end gap-2">
            <div className="max-w-full rounded-2xl bg-[#0a0a0a] px-5 py-3.5 text-[15px] leading-7 text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <p className="whitespace-pre-wrap break-words">{content}</p>
            </div>

            <span className="pr-1 text-[11px] font-medium text-[#b0b8c8]">
                You
            </span>
        </div>
    );
}

function AssistantMessage({
    content,
    sources,
    pending,
    error,
}: {
    content: string;
    sources?: ChatSource[];
    pending?: boolean;
    error?: boolean;
}) {
    const hasSources = Array.isArray(sources) && sources.length > 0;

    return (
        <div className="flex flex-col gap-3">
            {/* Avatar row */}
            <div className="flex items-center gap-2.5 px-1">
                <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-white ${error
                            ? "bg-red-500"
                            : "bg-[#0a0a0a]"
                        }`}
                >
                    {error ? "!" : "AI"}
                    {!error && (
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-[#00c896]" />
                    )}
                </div>

                <span className="text-[11px] font-medium text-[#94a0b8]">
                    {error ? "Assistant error" : "Assistant"}
                </span>
            </div>

            {/* Message card */}
            <Card
                className={`rounded-2xl border px-5 py-4 ${error
                        ? "border-red-200/60 bg-red-50/60 shadow-[0_4px_16px_rgba(239,68,68,0.06)]"
                        : "border-[#e8edf4] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                    }`}
            >
                {pending ? (
                    <TypingState />
                ) : (
                    <p
                        className={`whitespace-pre-wrap break-words text-[15px] leading-7 ${error ? "text-red-600" : "text-[#1e293b]"
                            }`}
                    >
                        {content}
                    </p>
                )}
            </Card>

            {!pending && hasSources ? <SourcesBlock sources={sources} /> : null}
        </div>
    );
}

function TypingState() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#0066ff]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00c896] [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#0066ff]/50 [animation-delay:240ms]" />
            </div>

            <span className="text-[13px] font-medium text-[#94a0b8]">
                Thinking through your documents...
            </span>
        </div>
    );
}

function SourcesBlock({ sources }: { sources: ChatSource[] }) {
    return (
        <div className="mt-1 flex flex-col gap-2">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a0b8]">
                Sources
            </p>

            <div className="flex flex-col gap-2">
                {sources.map((source) => (
                    <SourceItem key={source.id} source={source} />
                ))}
            </div>
        </div>
    );
}

function SourceItem({ source }: { source: ChatSource }) {
    return (
        <div className="group rounded-xl border border-[#e8edf4] bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-[#0066ff]/15 hover:shadow-[0_4px_16px_rgba(0,102,255,0.06)]">
            <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <p className="truncate text-[13px] font-medium text-[#0a0a0a]">
                        {source.filename || "Document"}
                    </p>
                </div>

                {source.chunkIndex !== null && source.chunkIndex !== undefined ? (
                    <span className="shrink-0 rounded-md bg-[#fafbfd] px-2 py-0.5 text-[10px] font-medium text-[#94a0b8]">
                        chunk #{source.chunkIndex}
                    </span>
                ) : null}
            </div>

            {typeof source.distance === "number" ? (
                <p className="mb-1.5 text-[10px] text-[#b0b8c8]">
                    distance {source.distance.toFixed(4)}
                </p>
            ) : null}

            {source.content ? (
                <p className="line-clamp-3 whitespace-pre-wrap break-words text-[12px] leading-5 text-[#64748b]">
                    {source.content}
                </p>
            ) : (
                <p className="text-[12px] leading-5 text-[#b0b8c8]">
                    No source content available.
                </p>
            )}
        </div>
    );
}