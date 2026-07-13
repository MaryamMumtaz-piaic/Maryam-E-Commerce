/**
 * ShopChrome — compact category header + skeleton loader.
 *
 * Breadcrumbs and hero section removed; replaced with a slim inline
 * title strip that sits flush against the navbar with minimal top padding.
 */

type CategoryHeaderProps = {
  eyebrow: string;
  title: string;
};

/** Ultra-compact one-line category header. No breadcrumbs. No hero block. */
export function ShopHero({ eyebrow, title }: CategoryHeaderProps) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-[1.75rem]">
        {title}
      </h1>
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-dark)] sm:inline">
        {eyebrow}
      </span>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
      <div className="hidden lg:block">
        <div className="skeleton h-[480px] w-full rounded-2xl" />
      </div>
      <div className="min-w-0">
        <div className="skeleton h-12 w-full rounded-2xl" />
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
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
