import { HTMLAttributes } from "react";

type PanelProps = HTMLAttributes<HTMLDivElement>;

export function Panel({ className = "", ...props }: PanelProps) {
    return (
        <div
            className={`rounded-2xl border border-[#e8edf4] bg-[#fafbfd] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${className}`}
            {...props}
        />
    );
}