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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
                title: "Welcome back",
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
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafbfd] text-[#64748b]">
                <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 animate-spin text-[#0066ff]" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="52" strokeDashoffset="14" strokeLinecap="round" />
                    </svg>
                    Loading workspace...
                </div>
            </div>
        );
    }

    return (
        <AuthShell
            title="Welcome back"
            description="Sign in to continue your AI workspace."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-[#0066ff] transition hover:text-[#0052cc]"
                    >
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Email" error={errors.email?.message}>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        autoComplete="email"
                    />
                </Field>

                <Field label="Password" error={errors.password?.message}>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        {...register("password")}
                        autoComplete="current-password"
                    />
                </Field>

                {loginMutation.isError && (
                    <div className="rounded-xl border border-red-200/60 bg-red-50/60 px-4 py-3 text-[13px] text-red-600">
                        {loginMutation.error.message}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || loginMutation.isPending}
                    className="h-12 w-full"
                >
                    {isSubmitting || loginMutation.isPending
                        ? "Logging in..."
                        : "Login"}
                </Button>
            </form>
        </AuthShell>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-[13px] font-medium text-[#0a0a0a]">
                {label}
            </label>
            {children}
            {error ? (
                <p className="mt-2 text-[13px] text-red-500">{error}</p>
            ) : null}
        </div>
    );
}