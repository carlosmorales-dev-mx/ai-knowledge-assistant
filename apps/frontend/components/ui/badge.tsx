type BadgeProps = {
    children: React.ReactNode;
    tone?: "neutral" | "success" | "warning" | "danger" | "primary";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
    const tones = {
        neutral: "border-ai-border bg-ai-surface-soft text-ai-text-muted",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        danger: "border-rose-200 bg-rose-50 text-rose-700",
        primary: "border-sky-200 bg-sky-50 text-sky-700",
    };

    return (
        <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}
        >
            {children}
        </span>
    );
}