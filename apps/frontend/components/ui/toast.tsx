"use client";

import { useToastStore } from "@/stores/toast.store";

export function ToastContainer() {
    const toasts = useToastStore((s) => s.toasts);
    const removeToast = useToastStore((s) => s.removeToast);

    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-md ${toast.type === "error"
                            ? "border-ai-danger/20 bg-ai-danger/5 text-ai-danger"
                            : toast.type === "success"
                                ? "border-green-500/20 bg-green-500/5 text-green-600"
                                : "border-ai-border bg-ai-surface text-ai-text"
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium">{toast.title}</p>
                            {toast.description && (
                                <p className="text-xs opacity-80">
                                    {toast.description}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-xs opacity-60 hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}