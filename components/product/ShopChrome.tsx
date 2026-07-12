import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";

type Crumb = { label: string; href?: string };

export function ShopHero({
  breadcrumb,
  eyebrow,
  title,
  description,
  count,
}: {
  breadcrumb: Crumb[];
  eyebrow: string;
  title: string;
  description?: string | null;
  count: number;
}) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-ink-soft">
        {breadcrumb.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className="transition hover:text-[var(--color-gold-dark)]">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink">{c.label}</span>
            )}
            {i < breadcrumb.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-line" />}
          </span>
        ))}
      </nav>

      {/* Compact header — subtle gradient, minimal height */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[linear-gradient(105deg,#ffffff_0%,#fdfbf6_60%,var(--color-gold-soft)_180%)] px-6 py-6 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-gold)]/10 blur-[80px]" aria-hidden />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
              {eyebrow}
            </p>
            <h1 className="mt-1.5 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-[2.5rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            )}
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-gold)]/25 bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
            <span className="font-semibold text-[var(--color-gold-dark)]">{count}</span>
            {count === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
      <div className="hidden lg:block">
        <div className="skeleton h-[520px] w-full rounded-2xl" />
      </div>
      <div className="min-w-0">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="skeleton aspect-square w-full rounded-[var(--radius-card)]" />
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
