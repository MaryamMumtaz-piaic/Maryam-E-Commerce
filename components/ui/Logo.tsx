import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Maryam — home"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="10"
            className="fill-[var(--color-gold-soft)] stroke-[var(--color-gold)]"
            strokeWidth="1.5"
          />
          {/* Artistic M that "encompasses" the name */}
          <path
            d="M9 29V12l11 12 11-12v17"
            className="stroke-[var(--color-gold-dark)]"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-serif text-2xl leading-none tracking-tight text-ink">
        Maryam
      </span>
    </Link>
  );
}
