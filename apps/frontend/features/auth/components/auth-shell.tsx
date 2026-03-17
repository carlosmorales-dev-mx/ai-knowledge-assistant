import type { ReactNode } from "react";

type AuthShellProps = {
    title: string;
    description: string;
    footer: ReactNode;
    children: ReactNode;
};

export function AuthShell({
    title,
    description,
    footer,
    children,
}: AuthShellProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-ai-bg px-6 py-10">
            <div className="w-full max-w-md rounded-3xl border border-ai-border bg-ai-surface p-8 shadow-sm">
                <div className="mb-6">
                    <h1 className="mb-2 text-2xl font-semibold text-ai-text">{title}</h1>
                    <p className="text-sm text-ai-text-muted">{description}</p>
                </div>

                {children}

                <div className="mt-6 text-sm text-ai-text-muted">{footer}</div>
            </div>
        </div>
    );
}