"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField, GoogleButton, TermsConsent, Divider } from "@/components/auth/AuthControls";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  function onGoogle() {
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    signIn("google", { callbackUrl }).catch(() => setError("Google sign-in is not available right now."));
  }

  return (
    <AuthShell
      heading="Welcome Back!"
      description="Discover premium products, exclusive collections, and a seamless shopping experience. Sign in to continue your journey with Maryam Shop."
    >
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-ink">Sign in</h1>
        <p className="mt-1.5 text-sm text-ink-soft">Welcome back — let&apos;s pick up where you left off.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <AuthField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required autoComplete="current-password" />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-ink-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-[var(--color-gold)]"
            />
            Remember me
          </label>
          <Link href="/contact" className="font-medium text-[var(--color-gold-dark)] hover:underline">
            Forgot password?
          </Link>
        </div>

        <TermsConsent
          checked={agreed}
          onChange={(v) => {
            setAgreed(v);
            if (v) setAgreeError(false);
          }}
          error={agreeError}
        />

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </Button>

        <Divider text="or" />

        <GoogleButton onClick={onGoogle} />
      </form>

      <div className="mt-5 rounded-xl border border-line bg-surface-alt px-4 py-3 text-xs text-ink-soft">
        <p className="font-medium text-ink">Demo accounts</p>
        <p className="mt-1">Admin: m.samiwaseem1234@gmail.com / admin1234</p>
        <p>Customer: customer@maryam.shop / demo1234</p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[var(--color-gold-dark)] hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthShell>
  );
}
