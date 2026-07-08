"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { CartIcon, HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

// Deterministic aspect-ratio pattern gives the masonry its natural, Pinterest-like
// rhythm of tall / medium / short cards without random values (which would cause
// hydration mismatches and layout shift). Fixed ratios also reserve height up-front,
// so images never push content around as they lazy-load.
// WEIGHTS mirror each ratio's height-per-width (height / width) so the greedy
// distributor can balance column heights without measuring the DOM.
const RATIOS = [
  "aspect-[3/4]", // tall
  "aspect-[4/5]", // medium-tall
  "aspect-square", // medium
  "aspect-[5/6]", // medium
  "aspect-[2/3]", // tall
  "aspect-[4/5]", // medium-tall
  "aspect-square", // medium
  "aspect-[3/4]", // tall
];
const WEIGHTS = [4 / 3, 5 / 4, 1, 6 / 5, 3 / 2, 5 / 4, 1, 4 / 3];

// Column count per breakpoint — Mobile 2 · Tablet 3 · Laptop 4 · Desktop 5 · Wide 6.
function columnsForWidth(w: number): number {
  if (w >= 1536) return 6;
  if (w >= 1280) return 5;
  if (w >= 1024) return 4;
  if (w >= 640) return 3;
  return 2;
}

function useColumnCount(): number {
  // SSR + first client render use 4 so hydration matches; the real value is
  // applied in the post-hydration effect, then kept in sync on resize.
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => setCount(columnsForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

// Greedy masonry: place each card into the currently shortest column. This keeps
// column heights balanced and guarantees the last row is never a single isolated
// card with empty space beside it — the defining Pinterest layout behaviour.
function distributeIntoColumns(items: ProductView[], columnCount: number) {
  const columns: { product: ProductView; ratio: string }[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  const heights = new Array<number>(columnCount).fill(0);

  items.forEach((product, idx) => {
    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    columns[shortest].push({ product, ratio: RATIOS[idx % RATIOS.length] });
    heights[shortest] += WEIGHTS[idx % WEIGHTS.length];
  });

  return columns;
}

function GalleryCard({ product, ratio }: { product: ProductView; ratio: string }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-alt)] shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className={cn("relative w-full overflow-hidden", ratio)}>
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          {/* Product Image — lazy-loaded, GPU-accelerated zoom on hover */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 18vw"
            className="object-cover transition-transform duration-[400ms] ease-out will-change-transform group-hover:scale-110"
          />

          {/* Fade overlay — subtle at rest, deepens on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Quick View — fades + slides up on hover */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[var(--color-ink)] shadow-xl transition-transform duration-300 group-hover:translate-y-0">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </span>
          </div>
        </Link>

        {/* Discount Badge */}
        {onSale && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist Button — pops on hover, fills when active */}
        <button
          type="button"
          onClick={() =>
            toggle({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
            })
          }
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95",
            wished ? "text-[var(--color-gold-dark)]" : "text-[var(--color-ink)]",
          )}
        >
          <HeartIcon className={cn("h-4 w-4 transition-transform duration-300", wished && "scale-110 fill-[var(--color-gold)]")} />
        </button>

        {/* Bottom info + Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
            {product.categoryName}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-1 block text-sm font-semibold text-white transition-colors duration-200 hover:text-[var(--color-gold)]"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-white">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-white/60 line-through">{formatPrice(product.compareAt!)}</span>
            )}
          </div>

          {/* Add to Cart — slides up + fades in on hover */}
          <button
            type="button"
            onClick={() =>
              add({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                stock: product.stock,
              })
            }
            disabled={product.stock <= 0}
            className="mt-2.5 flex h-9 w-full translate-y-2 items-center justify-center gap-1.5 rounded-full bg-white text-[12px] font-semibold text-[var(--color-ink)] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[var(--color-gold)] hover:text-white disabled:cursor-not-allowed disabled:bg-white/60"
          >
            <CartIcon className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TopSellingGallery({ products }: { products: ProductView[] }) {
  const columnCount = useColumnCount();

  if (products.length === 0) return null;

  // Take up to 16 top-selling products for a rich, browse-worthy gallery.
  const items = products.slice(0, 16);
  const columns = distributeIntoColumns(items, columnCount);

  return (
    <section id="top-selling" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Section Header — unchanged */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Customer Favorites
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Top Selling Products
          </h2>
          <div className="mt-3 h-px w-12 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Explore our bestselling collection — curated, loved, and trusted by our community.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-all duration-200 flex-shrink-0 self-start sm:self-auto"
        >
          Shop all
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Pinterest-style masonry — greedy shortest-column distribution keeps
          columns height-balanced and the last row never leaves an isolated card.
          Mobile 2 · Tablet 3 · Laptop 4 · Desktop 5 · Wide 6 columns. */}
      <div className="flex gap-3 sm:gap-4">
        {columns.map((column, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
            {column.map(({ product, ratio }) => (
              <GalleryCard key={product.id} product={product} ratio={ratio} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
