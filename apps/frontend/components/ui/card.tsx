import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
    return (
        <div
            className={`rounded-3xl border border-ai-border bg-ai-surface shadow-sm ${className}`}
            {...props}
        />
    );
}