"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 font-serif text-3xl tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-soft">Sign in to your Maryam account.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-line bg-surface-alt px-4 py-3 text-xs text-ink-soft">
        <p className="font-medium text-ink">Demo accounts</p>
        <p className="mt-1">Admin: m.samiwaseem1234@gmail.com / admin1234</p>
        <p>Customer: customer@maryam.shop / demo1234</p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[var(--color-gold-dark)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:outline-none"
      />
    </label>
  );
}
