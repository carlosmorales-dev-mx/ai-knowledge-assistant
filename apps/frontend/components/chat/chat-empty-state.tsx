export function ChatEmptyState() {
    return (
        <div className="flex flex-1 items-start justify-center px-6 pt-24">
            <div className="max-w-2xl text-center">
                <h2 className="text-4xl font-semibold tracking-tight text-ai-text-strong">
                    Start a new conversation
                </h2>
                <p className="mt-4 text-base leading-8 text-ai-muted">
                    Ask about your PDFs and the assistant will retrieve relevant chunks,
                    build context, and answer using your document knowledge base.
                </p>
            </div>
        </div>
    );
}