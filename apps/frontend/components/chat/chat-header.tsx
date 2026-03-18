type ChatHeaderProps = {
    title?: string;
    subtitle?: string;
};

export function ChatHeader({
    title = "AI Knowledge Assistant",
    subtitle = "Ask questions across your uploaded knowledge base.",
}: ChatHeaderProps) {
    return (
        <div className="border-b border-[#e8edf4] bg-white/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
                {/* Left — title area */}
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a0a0a] text-[11px] font-bold tracking-[0.14em] text-white">
                        AI
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-[#00c896]" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#0a0a0a]">
                            {title}
                        </h1>
                        <p className="truncate text-[12px] text-[#94a0b8]">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Right — status indicators */}
                <div className="hidden items-center gap-2 sm:flex">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#00c896]/15 bg-[#00c896]/5 px-2.5 py-1 text-[10px] font-semibold text-[#059669]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00c896]" />
                        Ready
                    </span>

                    <span className="inline-flex items-center rounded-lg border border-[#e8edf4] bg-[#fafbfd] px-2.5 py-1 text-[10px] font-medium text-[#94a0b8]">
                        RAG
                    </span>
                </div>
            </div>
        </div>
    );
}