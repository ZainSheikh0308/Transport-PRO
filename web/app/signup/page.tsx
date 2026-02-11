"use client";

import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await cred.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      await fetch("/api/auth/bootstrap", { method: "POST" });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form className="card w-full max-w-md p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-cyan-200">Create account</h1>
        <p className="mt-1 text-sm text-slate-400">Start using TransportPro today</p>

        <div className="mt-5 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="mt-4 text-sm text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
