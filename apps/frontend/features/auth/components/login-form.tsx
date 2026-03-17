"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { AuthShell } from "./auth-shell";
import {
    loginFormSchema,
    type LoginFormValues,
} from "@/features/auth/validations/auth.schemas";

export function LoginForm() {
    const router = useRouter();
    const loginMutation = useLogin();
    const addToast = useToastStore((state) => state.addToast);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (hasBootstrapped && !isBootstrapping && isAuthenticated) {
            router.replace("/chat");
        }
    }, [hasBootstrapped, isBootstrapping, isAuthenticated, router]);

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await loginMutation.mutateAsync(values);

            addToast({
                type: "success",
                title: "Welcome back 👋",
                description: "You have successfully logged in",
            });

            router.replace("/chat");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unable to login";

            addToast({
                type: "error",
                title: "Login failed",
                description: message,
            });
        }
    };

    if (!hasBootstrapped || isBootstrapping) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <AuthShell
            title="Login"
            description="Access your AI Knowledge Assistant workspace"
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-ai-text underline">
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-ai-danger">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-ai-danger">{errors.password.message}</p>
                    )}
                </div>

                {loginMutation.isError && (
                    <div className="rounded-2xl border border-ai-danger/20 bg-ai-danger/5 px-4 py-3 text-sm text-ai-danger">
                        {loginMutation.error.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || loginMutation.isPending}
                    className="w-full rounded-2xl bg-ai-dark px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting || loginMutation.isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </AuthShell>
    );
}