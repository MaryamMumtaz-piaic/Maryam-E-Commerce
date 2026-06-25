"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
];

export function ProductToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  function onSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
      <p className="text-sm text-ink-soft">
        {total} {total === 1 ? "product" : "products"}
      </p>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-ink-soft">Sort</span>
        <select
          value={current}
          onChange={(e) => onSort(e.target.value)}
          className="h-9 rounded-full border border-line bg-white px-3 text-sm text-ink focus:border-[var(--color-gold)] focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
