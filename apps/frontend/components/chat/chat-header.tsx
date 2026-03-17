type ChatHeaderProps = {
    title?: string;
};

export function ChatHeader({
    title = "AI Knowledge Assistant",
}: ChatHeaderProps) {
    return (
        <div className="border-b border-ai-border px-8 py-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-2xl font-semibold tracking-tight text-ai-text-strong">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-ai-muted">
                    Ask questions about your uploaded documents.
                </p>
            </div>
        </div>
    );
}