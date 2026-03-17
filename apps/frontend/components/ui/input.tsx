import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full rounded-2xl border border-ai-border bg-ai-surface-soft px-4 py-3 text-sm text-ai-text outline-none placeholder:text-ai-text-muted ${className}`}
            {...props}
        />
    );
}