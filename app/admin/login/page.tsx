"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCredentials } from "@/app/actions";
import { toast } from "react-toastify";

const AdminLogin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInWithCredentials(email.trim(), password);

            if (result?.error) {
                toast.error(result.error);
                setLoading(false);
                return;
            }

            if (result.role !== "ADMIN") {
                toast.error("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }

            toast.success("Welcome, Admin!");
            router.push("/admin");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 prata-regular">Admin Login</h1>
                        <p className="text-sm text-gray-500">Enter your credentials to access the dashboard</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Sign In to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
