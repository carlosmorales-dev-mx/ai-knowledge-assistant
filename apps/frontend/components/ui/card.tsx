import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
    return (
        <div
            className={`rounded-2xl border border-[#e8edf4] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${className}`}
            {...props}
        />
    );
}