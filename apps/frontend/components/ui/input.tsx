import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] text-[#0a0a0a] shadow-[0_2px_8px_rgba(0,0,0,0.03)] outline-none transition-all duration-200 placeholder:text-[#94a0b8] focus:border-[#0066ff]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,102,255,0.08)] ${className}`}
            {...props}
        />
    );
}