import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

export function Button({
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-ai-dark text-white hover:opacity-95",
        secondary:
            "border border-ai-border bg-ai-surface text-ai-text hover:bg-ai-surface-soft",
        ghost: "bg-transparent text-ai-text-muted hover:bg-ai-surface-soft hover:text-ai-text",
        danger: "bg-ai-danger text-white hover:opacity-95",
    };

    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}