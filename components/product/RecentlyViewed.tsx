"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed } from "@/lib/store/recentlyViewed";
import { formatPrice } from "@/lib/utils";

export function RecentlyViewed() {
  const items = useRecentlyViewed((s) => s.items);
  const clear = useRecentlyViewed((s) => s.clear);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated || items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
            Recently viewed
          </p>
          <h2 className="font-serif text-2xl tracking-tight text-ink">Pick up where you left off</h2>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-ink-soft hover:text-ink hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
        {items.map((item) => {
          const onSale = item.compareAt != null && item.compareAt > item.price;
          return (
            <div key={item.id} className="group w-40 shrink-0 sm:w-44">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-alt">
                <Link href={`/products/${item.slug}`} aria-label={item.name}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="176px"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-ink-soft">
                {item.categoryName}
              </p>
              <Link
                href={`/products/${item.slug}`}
                className="line-clamp-1 text-sm font-medium text-ink hover:text-[var(--color-gold-dark)]"
              >
                {item.name}
              </Link>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{formatPrice(item.price)}</span>
                {onSale && (
                  <span className="text-xs text-ink-soft line-through">
                    {formatPrice(item.compareAt!)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
