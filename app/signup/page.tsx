"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField, GoogleButton, TermsConsent, Divider } from "@/components/auth/AuthControls";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create account.");
        setLoading(false);
        return;
      }
      const signin = await signIn("credentials", { email, password, redirect: false });
      setLoading(false);
      if (signin?.error) {
        router.push("/login");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function onGoogle() {
    if (!agreed) {
      setAgreeError(true);
      return;
    }
    signIn("google", { callbackUrl: "/" }).catch(() => setError("Google sign-in is not available right now."));
  }

  return (
    <AuthShell
      heading="Welcome to Maryam Shop"
      description="Join a community of thoughtful shoppers. Create an account for a faster checkout, a personal wishlist, and access to exclusive collections."
    >
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-ink">Create account</h1>
        <p className="mt-1.5 text-sm text-ink-soft">It only takes a moment to get started.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <AuthField label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" required autoComplete="name" />
        <AuthField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" required autoComplete="new-password" />
        <AuthField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Re-enter your password" required autoComplete="new-password" />

        <TermsConsent
          checked={agreed}
          onChange={(v) => {
            setAgreed(v);
            if (v) setAgreeError(false);
          }}
          error={agreeError}
        />

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? "Creating account…" : "Create Account"}
        </Button>

        <Divider text="or" />

        <GoogleButton onClick={onGoogle} />
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-gold-dark)] hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
