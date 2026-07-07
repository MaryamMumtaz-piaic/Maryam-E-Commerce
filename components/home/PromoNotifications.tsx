"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

export type PromoNotice = {
  emoji: string;
  text: string;
  href: string;
};

const DEFAULT_PROMOS: PromoNotice[] = [
  { emoji: "🎉", text: "Flat 10% OFF on Leather Bags", href: "/categories/accessories" },
  { emoji: "🔥", text: "50% OFF Summer Collection", href: "/categories/apparel" },
  { emoji: "🚚", text: "Free Shipping on Orders Above $100", href: "/products" },
  { emoji: "⭐", text: "Limited Time Exclusive Deal", href: "/categories/beauty" },
];

// One notification appears every INTERVAL; each auto-hides after VISIBLE.
const INTERVAL_MS = 10_000;
const VISIBLE_MS = 5_000;
const EXIT_MS = 350;

export function PromoNotifications({
  promos = DEFAULT_PROMOS,
}: {
  promos?: PromoNotice[];
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");
  const cycle = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const dismiss = () => {
    setPhase((p) => (p === "in" ? "out" : p));
  };

  // Drives the recurring show/hide cadence.
  useEffect(() => {
    if (promos.length === 0) return;

    const showNext = () => {
      setIndex((i) => (i === 0 && cycle.current === 0 ? 0 : (i + 1) % promos.length));
      setPhase("in");
      timers.current.push(
        setTimeout(() => setPhase((p) => (p === "in" ? "out" : p)), VISIBLE_MS),
      );
    };

    // First one shows shortly after mount, then every INTERVAL_MS.
    const first = setTimeout(showNext, 1_500);
    const interval = setInterval(() => {
      cycle.current += 1;
      showNext();
    }, INTERVAL_MS);
    timers.current.push(first);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promos.length]);

  if (promos.length === 0 || phase === "hidden") return null;

  const promo = promos[index];

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-4 z-40 sm:bottom-8 sm:right-6"
      aria-live="polite"
    >
      <div
        key={`${index}-${cycle.current}`}
        onAnimationEnd={(e) => {
          if (e.animationName === "promo-out") setPhase("hidden");
        }}
        className={`pointer-events-auto relative w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur ${
          phase === "out" ? "promo-out" : "promo-in"
        }`}
        role="status"
      >
        <Link
          href={promo.href}
          onClick={dismiss}
          className="flex items-center gap-3 py-4 pl-4 pr-11 transition-colors hover:bg-surface-alt"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-gold-soft)] text-lg">
            {promo.emoji}
          </span>
          <span className="text-sm font-medium leading-snug text-ink">{promo.text}</span>
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        {phase === "in" && (
          <span
            className="promo-progress absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-gold)]"
            style={{ animationDuration: `${VISIBLE_MS}ms` }}
          />
        )}
      </div>
    </div>
  );
}
