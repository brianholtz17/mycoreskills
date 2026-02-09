"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import gsap from "gsap";
import { AUTH_BACKGROUND_GIF } from "../config/auth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();
  const signInWrapRef = useRef<HTMLDivElement>(null);

  const playSignInClick = () => {
    if (loading) return;
    try {
      const wrap = signInWrapRef.current;
      if (!wrap) return;
      gsap.killTweensOf(wrap);
      gsap.fromTo(
        wrap,
        { scale: 1 },
        {
          scale: 0.92,
          duration: 0.1,
          ease: "power2.in",
          yoyo: true,
          repeat: 1,
          repeatDelay: 0.06,
          clearProps: "scale",
        }
      );
    } catch {
      // ignore so sign-in always proceeds
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }
      const redirect = searchParams.get("redirectTo") ?? "/";
      window.location.href = redirect;
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Sign in failed. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
        MyCoreSkills
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        Sign in to your student dashboard
      </p>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="you@school.edu"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        {message && (
          <p
            className={`text-sm ${
              message.type === "error" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {message.text}
          </p>
        )}
        <div
          ref={signInWrapRef}
          className="inline-block w-full origin-center"
          style={{ transformOrigin: "center" }}
        >
          <button
            type="submit"
            disabled={loading}
            onClick={playSignInClick}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:pointer-events-none shadow-lg hover:shadow-blue-500/20 transition-colors active:scale-[0.98]"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-slate-400 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-slate-900 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${AUTH_BACKGROUND_GIF})` }}
    >
      <div className="absolute inset-0 bg-slate-900/70 pointer-events-none" aria-hidden />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-800/90 shadow-2xl backdrop-blur-xl p-8">
        <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
