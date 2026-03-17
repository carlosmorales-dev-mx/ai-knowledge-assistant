"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (hasBootstrapped && !isBootstrapping && isAuthenticated) {
      router.replace("/chat");
    }
  }, [hasBootstrapped, isBootstrapping, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await loginMutation.mutateAsync({
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
        <h1 className="mb-2 text-2xl font-semibold text-ai-text">Login</h1>
        <p className="mb-6 text-sm text-ai-text-muted">
          Access your AI Knowledge Assistant workspace
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-2xl bg-ai-dark px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {loginMutation.isError && (
          <p className="mt-4 text-sm text-ai-danger">
            Error: {loginMutation.error.message}
          </p>
        )}

        <p className="mt-6 text-sm text-ai-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-ai-text underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}