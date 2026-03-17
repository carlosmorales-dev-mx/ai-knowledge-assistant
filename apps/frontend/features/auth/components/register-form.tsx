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
                title: "Account created 🎉",
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
        return <div className="p-10">Loading...</div>;
    }

    return (
        <AuthShell
            title="Create account"
            description="Start using your AI Knowledge Assistant"
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-ai-text underline">
                        Login
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Full name"
                        {...register("fullName")}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />
                    {errors.fullName && (
                        <p className="mt-2 text-sm text-ai-danger">{errors.fullName.message}</p>
                    )}
                </div>

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

                <div>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword")}
                        className="w-full rounded-2xl border border-ai-border bg-ai-bg px-4 py-3 text-sm outline-none transition focus:border-ai-dark"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-ai-danger">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {registerMutation.isError && (
                    <div className="rounded-2xl border border-ai-danger/20 bg-ai-danger/5 px-4 py-3 text-sm text-ai-danger">
                        {registerMutation.error.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || registerMutation.isPending}
                    className="w-full rounded-2xl bg-ai-dark px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting || registerMutation.isPending
                        ? "Creating account..."
                        : "Register"}
                </button>
            </form>
        </AuthShell>
    );
}