import { HTMLAttributes } from "react";

type PanelProps = HTMLAttributes<HTMLDivElement>;

export function Panel({ className = "", ...props }: PanelProps) {
    return (
        <div
            className={`rounded-2xl border border-ai-border bg-ai-surface-soft ${className}`}
            {...props}
        />
    );
}