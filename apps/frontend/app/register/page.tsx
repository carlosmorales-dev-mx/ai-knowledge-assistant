"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RegisterPage() {
    const router = useRouter();
    const registerMutation = useRegister();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (hasBootstrapped && !isBootstrapping && isAuthenticated) {
            router.replace("/chat");
        }
    }, [hasBootstrapped, isBootstrapping, isAuthenticated, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (password !== confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        await registerMutation.mutateAsync({
            fullName,
            email,
            password,
        });

        router.replace("/chat");
    }

    if (!hasBootstrapped || isBootstrapping) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-ai-bg px-6">
            <div className="w-full max-w-md rounded-3xl border border-ai-border bg-ai-surface p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-semibold text-ai-text">Create account</h1>
                <p className="mb-6 text-sm text-ai-text-muted">
                    Start using your AI Knowledge Assistant
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full rounded-2xl bg-ai-dark px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {registerMutation.isPending ? "Creating account..." : "Register"}
                    </button>
                </form>

                {formError && <p className="mt-4 text-sm text-ai-danger">{formError}</p>}

                {registerMutation.isError && (
                    <p className="mt-4 text-sm text-ai-danger">
                        Error: {registerMutation.error.message}
                    </p>
                )}

                <p className="mt-6 text-sm text-ai-text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-ai-text underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}