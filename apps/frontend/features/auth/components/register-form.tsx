"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { AuthShell } from "./auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    registerFormSchema,
    type RegisterFormValues,
} from "@/features/auth/validations/auth.schemas";

export function RegisterForm() {
    const router = useRouter();
    const registerMutation = useRegister();
    const addToast = useToastStore((state) => state.addToast);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (hasBootstrapped && !isBootstrapping && isAuthenticated) {
            router.replace("/chat");
        }
    }, [hasBootstrapped, isBootstrapping, isAuthenticated, router]);

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            await registerMutation.mutateAsync({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            });

            addToast({
                type: "success",
                title: "Account created",
                description: "Welcome to your AI workspace",
            });

            router.replace("/chat");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unable to create account";

            addToast({
                type: "error",
                title: "Registration failed",
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
            title="Create account"
            description="Set up your workspace and start chatting with your documents."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[#0066ff] transition hover:text-[#0052cc]"
                    >
                        Login
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Full name" error={errors.fullName?.message}>
                    <Input
                        type="text"
                        placeholder="Your full name"
                        {...register("fullName")}
                        autoComplete="name"
                    />
                </Field>

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
                        placeholder="Create a password"
                        {...register("password")}
                        autoComplete="new-password"
                    />
                </Field>

                <Field
                    label="Confirm password"
                    error={errors.confirmPassword?.message}
                >
                    <Input
                        type="password"
                        placeholder="Repeat your password"
                        {...register("confirmPassword")}
                        autoComplete="new-password"
                    />
                </Field>

                {registerMutation.isError && (
                    <div className="rounded-xl border border-red-200/60 bg-red-50/60 px-4 py-3 text-[13px] text-red-600">
                        {registerMutation.error.message}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || registerMutation.isPending}
                    className="h-12 w-full"
                >
                    {isSubmitting || registerMutation.isPending
                        ? "Creating account..."
                        : "Create account"}
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