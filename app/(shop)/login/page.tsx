"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithCredentials } from "@/app/actions";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<"Login" | "Sign Up">("Login");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Registration failed");
          setLoading(false);
          return;
        }
        toast.success("Account created. Signing you in...");
      }
      const result = await signInWithCredentials(email.trim(), password);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success(currentState === "Login" ? "Welcome back!" : "Account created!");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-16">
      <form onSubmit={onSubmitHandler} className="flex flex-col w-full gap-4">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {currentState === "Sign Up" && (
          <input
            className="w-full px-3 py-2 border border-gray-800"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <span className="text-gray-500">Forgot your password?</span>
          {currentState === "Login" ? (
            <button
              type="button"
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer underline"
            >
              Create account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer underline"
            >
              Login here
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60"
        >
          {loading ? "Please wait..." : currentState === "Login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 w-full text-center">
        <p className="text-sm text-gray-500 mb-2">No account? Shop without signing in.</p>
        <Link
          href="/collection"
          className="text-sm font-medium text-gray-800 underline hover:no-underline"
        >
          Continue as guest →
        </Link>
      </div>
    </div>
  );
};

export default Login;
