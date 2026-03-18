import type { ReactNode } from "react";

type AuthShellProps = {
    title: string;
    description: string;
    footer: ReactNode;
    children: ReactNode;
};

export function AuthShell({
    title,
    description,
    footer,
    children,
}: AuthShellProps) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafbfd] px-6 py-10">
            {/* Subtle background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-[#0066ff]/5 blur-3xl" />
                <div className="absolute right-[10%] top-[18%] h-56 w-56 rounded-full bg-[#00c896]/5 blur-3xl" />
                <div className="absolute bottom-[8%] left-[40%] h-60 w-60 rounded-full bg-[#0066ff]/3 blur-3xl" />
            </div>

            <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                {/* Left column — branding */}
                <div className="hidden lg:block">
                    <div className="max-w-xl">
                        <div className="mb-5 inline-flex items-center rounded-lg border border-[#0066ff]/12 bg-[#0066ff]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0066ff]">
                            AI Knowledge Assistant
                        </div>

                        <h1 className="text-5xl font-semibold tracking-[-0.05em] text-[#0a0a0a]">
                            A modern workspace for grounded AI conversations
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-[#64748b]">
                            Upload PDFs, retrieve the right context, and chat with your
                            knowledge base in a product experience built for real demos and
                            real use.
                        </p>

                        <div className="mt-10 grid gap-3 sm:grid-cols-3">
                            <FeaturePill
                                label="Retrieve"
                                description="Relevant chunks, when needed"
                                tone="blue"
                            />
                            <FeaturePill
                                label="Ground"
                                description="Answers tied to your docs"
                                tone="green"
                            />
                            <FeaturePill
                                label="Present"
                                description="Portfolio-ready interface"
                                tone="neutral"
                            />
                        </div>
                    </div>
                </div>

                {/* Right column — form card */}
                <div className="w-full">
                    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#e8edf4] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-0">
                        {/* Top accent */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-[#0066ff] via-[#00c896] to-transparent" />

                        <div className="p-8 sm:p-9">
                            <div className="mb-8">
                                <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a0a0a] text-[13px] font-bold tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                                    AI
                                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#00c896]" />
                                </div>

                                <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[#0a0a0a]">
                                    {title}
                                </h2>
                                <p className="mt-2 text-[14px] leading-6 text-[#64748b]">
                                    {description}
                                </p>
                            </div>

                            {children}

                            <div className="mt-7 border-t border-[#e8edf4] pt-5 text-[14px] text-[#64748b]">
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeaturePill({
    label,
    description,
    tone = "neutral",
}: {
    label: string;
    description: string;
    tone?: "blue" | "green" | "neutral";
}) {
    const tones = {
        blue: "border-[#0066ff]/12 bg-[#0066ff]/3",
        green: "border-[#00c896]/15 bg-[#00c896]/3",
        neutral: "border-[#e8edf4] bg-white",
    };

    const labelColors = {
        blue: "text-[#0066ff]",
        green: "text-[#059669]",
        neutral: "text-[#94a0b8]",
    };

    return (
        <div className={`rounded-xl border p-4 ${tones[tone]}`}>
            <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${labelColors[tone]}`}>
                {label}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[#3a3f4b]">{description}</p>
        </div>
    );
}