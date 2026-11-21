"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      const sessionResponse = await fetch("/api/auth/get-session", { cache: "no-store" });
      if (!sessionResponse.ok) {
        throw new Error("Could not verify the new session.");
      }
      const session = (await sessionResponse.json()) as { user?: { role?: string } } | null;
      router.push(session?.user?.role === "ADMIN" ? "/admin" : "/account");
      router.refresh();
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center space-y-2 mb-8">
          <p className="text-[10px] tracking-[0.3em] font-mono uppercase text-[#D4AF37]">
            MANAGEMENT ACCESS
          </p>
          <h1 className="text-2xl font-serif text-white tracking-widest uppercase">
            ARONNO
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Sign in to access your luxury store dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="admin@aronno.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#D4AF37] hover:bg-[#b89528] text-neutral-900 font-bold text-xs tracking-widest uppercase rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}