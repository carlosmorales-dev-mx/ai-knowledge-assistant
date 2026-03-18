"use client";

import { useToastStore } from "@/stores/toast.store";

export function ToastContainer() {
    const toasts = useToastStore((s) => s.toasts);
    const removeToast = useToastStore((s) => s.removeToast);

    return (
        <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
            {toasts.map((toast) => {
                const toneClasses =
                    toast.type === "error"
                        ? "border-red-200/60 bg-white text-red-600 shadow-[0_8px_30px_rgba(239,68,68,0.1)]"
                        : toast.type === "success"
                            ? "border-[#00c896]/20 bg-white text-[#059669] shadow-[0_8px_30px_rgba(0,200,150,0.1)]"
                            : "border-[#0066ff]/15 bg-white text-[#0a0a0a] shadow-[0_8px_30px_rgba(0,102,255,0.08)]";

                const dotClasses =
                    toast.type === "error"
                        ? "bg-red-500"
                        : toast.type === "success"
                            ? "bg-[#00c896]"
                            : "bg-[#0066ff]";

                const label =
                    toast.type === "error"
                        ? "Error"
                        : toast.type === "success"
                            ? "Success"
                            : "Info";

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto overflow-hidden rounded-2xl border transition-all duration-200 ${toneClasses}`}
                    >
                        {/* Top accent */}
                        <div className={`h-[2px] w-full ${toast.type === "error"
                                ? "bg-gradient-to-r from-red-400 via-red-500 to-transparent"
                                : toast.type === "success"
                                    ? "bg-gradient-to-r from-[#00c896] via-[#0066ff] to-transparent"
                                    : "bg-gradient-to-r from-[#0066ff] via-[#00c896] to-transparent"
                            }`} />

                        <div className="flex items-start gap-3 px-4 py-3.5">
                            <div className="mt-0.5 flex shrink-0 items-center">
                                <span className={`h-2 w-2 rounded-full ${dotClasses}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-60">
                                        {label}
                                    </span>
                                </div>

                                <p className="text-[13px] font-semibold leading-5">
                                    {toast.title}
                                </p>

                                {toast.description ? (
                                    <p className="mt-0.5 text-[12px] leading-5 opacity-70">
                                        {toast.description}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] opacity-40 transition hover:bg-black/5 hover:opacity-100"
                                aria-label="Dismiss notification"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}