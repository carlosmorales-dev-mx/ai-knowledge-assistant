export function ChatEmptyState() {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/70 bg-white/82 text-xl shadow-[0_14px_34px_rgba(99,102,241,0.12)] backdrop-blur-2xl">
                ✨
            </div>

            <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-ai-text sm:text-4xl">
                Start a conversation
            </h2>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ai-text-muted">
                Ask questions about your PDFs and get grounded answers from your
                document knowledge base.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <span className="rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm text-ai-text-muted shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                    Retrieval-aware
                </span>
                <span className="rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm text-ai-text-muted shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                    Grounded on documents
                </span>
                <span className="rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm text-ai-text-muted shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                    Built for real workflows
                </span>
            </div>
        </div>
    );
}