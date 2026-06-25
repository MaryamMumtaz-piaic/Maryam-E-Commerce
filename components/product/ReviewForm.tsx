"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-6 text-center">
        <p className="text-sm text-ink-soft">
          <Link href="/login" className="font-medium text-[var(--color-gold-dark)] hover:underline">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not submit review.");
      return;
    }
    setMessage(data.message ?? "Thank you for your review!");
    setTitle("");
    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] border border-line p-6">
      <p className="text-sm font-semibold text-ink">Write a review</p>

      {message && (
        <p className="mt-3 rounded-xl border border-line bg-surface-alt px-4 py-2.5 text-sm text-ink">{message}</p>
      )}

      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} stars`}
            className="p-0.5"
          >
            <svg
              viewBox="0 0 20 20"
              className={cn("h-6 w-6", (hover || rating) >= n ? "text-[var(--color-gold)]" : "text-line")}
              fill="currentColor"
            >
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="mt-4 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your experience…"
        required
        rows={4}
        className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none"
      />
      <div className="mt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
