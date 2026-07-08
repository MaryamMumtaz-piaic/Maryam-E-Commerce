"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "@/components/ui/icons";

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const inputType = isPassword && show ? "text" : type;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white/70 px-4 text-sm text-ink placeholder:text-ink-soft transition-all duration-200 focus:border-[var(--color-gold)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--color-gold)]/15"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-ink"
          >
            {show ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </label>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white text-sm font-semibold text-ink shadow-sm transition-all duration-300 hover:border-ink/25 hover:shadow-md active:scale-[0.98]"
    >
      <GoogleIcon className="h-5 w-5" />
      Continue with Google
    </button>
  );
}

export function TermsConsent({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: boolean;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-line text-[var(--color-gold)] accent-[var(--color-gold)] focus:ring-[var(--color-gold)]"
        />
        <span>
          I have read and agree to the{" "}
          <Link href="/legal" className="font-medium text-[var(--color-gold-dark)] hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-[var(--color-gold-dark)] hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          Please accept the Terms &amp; Conditions to continue.
        </p>
      )}
    </div>
  );
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs uppercase tracking-wider text-ink-soft">{text}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
