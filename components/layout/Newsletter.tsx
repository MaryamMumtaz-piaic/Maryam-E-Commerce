"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Front-end only — no backend. Native email validation gates submission.
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">Stay Updated</p>
      <p className="mt-2 text-sm text-ink-soft">
        Get the latest products, exclusive offers, and special discounts delivered to your inbox.
      </p>

      {subscribed ? (
        <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--color-gold)] bg-[var(--color-gold-soft)] px-4 py-2.5 text-sm font-medium text-[var(--color-gold-dark)]">
          <CheckIcon className="h-4 w-4" />
          You&apos;re subscribed — welcome to Maryam.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            className="h-11 flex-1 rounded-full border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
          />
          <button
            type="submit"
            className="h-11 flex-shrink-0 rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] transition-all duration-300 hover:bg-[var(--color-gold-dark)] hover:shadow-[0_8px_24px_rgba(200,162,75,0.45)] active:scale-[0.97]"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
