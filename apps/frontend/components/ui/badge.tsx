type BadgeProps = {
    children: React.ReactNode;
    tone?: "neutral" | "success" | "warning" | "danger" | "primary";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
    const tones = {
        neutral: "border-[#e8edf4] bg-[#fafbfd] text-[#64748b]",
        success: "border-[#00c896]/20 bg-[#00c896]/5 text-[#059669]",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        danger: "border-red-200 bg-red-50 text-red-600",
        primary: "border-[#0066ff]/15 bg-[#0066ff]/5 text-[#0066ff]",
    };

    return (
        <span
            className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${tones[tone]}`}
        >
            {children}
        </span>
    );
}