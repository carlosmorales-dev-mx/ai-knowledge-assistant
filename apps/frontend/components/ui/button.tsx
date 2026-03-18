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
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066ff]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-[#0a0a0a] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[#1a1a1a] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)]",
        secondary:
            "border border-[#e8edf4] bg-white text-[#3a3f4b] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#d0d7e3] hover:bg-[#fafbfd]",
        ghost:
            "bg-transparent text-[#64748b] hover:bg-[#f4f6f9] hover:text-[#0a0a0a]",
        danger:
            "bg-red-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.2)] hover:bg-red-600",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
}