import { ChatSource } from "@/features/chat/types/chat.types";
import { Card } from "@/components/ui/card";
import { Panel } from "@/components/ui/panel";

export type ChatMessageItem = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: ChatSource[];
};

type ChatMessagesProps = {
    messages: ChatMessageItem[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
    if (messages.length === 0) return null;

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {messages.map((message) => {
                const isUser = message.role === "user";
                const hasSources =
                    !isUser &&
                    Array.isArray(message.sources) &&
                    message.sources.length > 0;

                return (
                    <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        <div className={isUser ? "max-w-xl" : "max-w-3xl"}>
                            <div
                                className={`rounded-[28px] px-5 py-4 shadow-sm ${isUser
                                        ? "bg-ai-dark text-white"
                                        : "border border-ai-border bg-white text-ai-text"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-[15px] leading-7">
                                    {message.content}
                                </p>
                            </div>

                            {hasSources && (
                                <Card className="mt-3 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ai-text-muted">
                                            Sources
                                        </p>
                                        <span className="text-xs text-ai-text-soft">
                                            {message.sources!.length} found
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {message.sources!.map((source) => (
                                            <Panel key={source.id} className="p-4">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold text-ai-text">
                                                        {source.filename || "Unknown document"}
                                                    </p>

                                                    <span className="rounded-full border border-ai-border bg-white px-2 py-1 text-[11px] font-medium text-ai-text-muted">
                                                        chunk{" "}
                                                        {typeof source.chunkIndex === "number"
                                                            ? source.chunkIndex
                                                            : "-"}
                                                    </span>
                                                </div>

                                                {typeof source.distance === "number" && (
                                                    <p className="mb-2 text-xs text-ai-text-muted">
                                                        Distance: {source.distance.toFixed(4)}
                                                    </p>
                                                )}

                                                <p className="whitespace-pre-wrap text-sm leading-6 text-ai-text-muted">
                                                    {source.content || "No source content available."}
                                                </p>
                                            </Panel>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}