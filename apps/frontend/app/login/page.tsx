"use client";

import { useEffect, useState } from "react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/storage";

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isAuthenticated()) {
            router.replace("/chat");
        }
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await loginMutation.mutateAsync({
            email,
            password,
        });

        router.push("/chat");
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </button>
            </form>

            {loginMutation.isError && (
                <p style={{ color: "red" }}>
                    Error: {loginMutation.error.message}
                </p>
            )}
        </div>
    );
}