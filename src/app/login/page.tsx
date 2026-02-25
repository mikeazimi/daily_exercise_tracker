"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isNativeApp } from "@/lib/capacitor";

type Mode = "signin" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  function getRedirectUrl(path: string) {
    return isNativeApp()
      ? `https://daily-exercise-tracker-nine.vercel.app${path}`
      : `${window.location.origin}${path}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl("/auth/callback?next=/login/reset"),
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for the password reset link.");
      }
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl("/auth/callback"),
        },
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for the confirmation link.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/");
      }
    }

    setLoading(false);
  }

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setMessage("");
  }

  const title =
    mode === "forgot"
      ? "Reset Password"
      : mode === "signup"
        ? "Sign Up"
        : "Sign In";

  const buttonLabel =
    mode === "forgot"
      ? "Send Reset Link"
      : mode === "signup"
        ? "Sign Up"
        : "Sign In";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Daily Exercise</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "forgot"
              ? "Enter your email to receive a reset link"
              : "Track your workouts, measure your progress"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary text-primary-foreground font-medium py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : buttonLabel}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-muted-foreground">{message}</p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {mode === "forgot" ? (
            <>
              Remember your password?{" "}
              <button
                onClick={() => switchMode("signin")}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("signin")}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
