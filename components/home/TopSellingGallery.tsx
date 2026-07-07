"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function GalleryCard({
  product,
  size = "normal",
}: {
  product: ProductView;
  size?: "normal" | "tall" | "wide";
}) {
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  const aspectClass =
    size === "tall"
      ? "aspect-[3/4]"
      : size === "wide"
        ? "aspect-[16/9]"
        : "aspect-square";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[var(--color-surface-alt)]",
        size === "tall" && "row-span-2",
      )}
    >
      <div className={cn("relative w-full overflow-hidden", aspectClass)}>
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          {/* Product Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay — always subtle, more on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400" />

          {/* Hover: "View Product" overlay button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Product
            </span>
          </div>
        </Link>

        {/* Discount Badge */}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md z-10">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist Button */}
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
            "absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur shadow-md transition-all duration-200 hover:scale-110",
            wished ? "text-[var(--color-gold-dark)]" : "text-[var(--color-ink)]",
          )}
        >
          <HeartIcon className={cn("h-4 w-4", wished && "fill-[var(--color-gold)]")} />
        </button>

        {/* Bottom Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] mb-1">
            {product.categoryName}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="block text-sm font-semibold text-white hover:text-[var(--color-gold)] transition-colors duration-200 line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-bold text-white">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-white/60 line-through">
                {formatPrice(product.compareAt!)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopSellingGallery({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  // Take up to 8 products
  const items = products.slice(0, 8);

  // Assign sizes for visual variety in a masonry-like layout
  const sizeMap: ("normal" | "tall" | "wide")[] = [
    "tall",    // 0 — spans 2 rows
    "normal",  // 1
    "normal",  // 2
    "wide",    // 3 — wider card
    "normal",  // 4
    "tall",    // 5 — spans 2 rows
    "normal",  // 6
    "normal",  // 7
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
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
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Gallery Grid — responsive masonry-style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] lg:auto-rows-[240px]">
        {items.map((product, idx) => (
          <div
            key={product.id}
            className={cn(
              // tall cards span 2 rows
              sizeMap[idx] === "tall" && "row-span-2",
              // wide cards span 2 columns on desktop only
              sizeMap[idx] === "wide" && "lg:col-span-2",
            )}
          >
            <GalleryCard product={product} size={sizeMap[idx]} />
          </div>
        ))}
      </div>
    </section>
  );
}
