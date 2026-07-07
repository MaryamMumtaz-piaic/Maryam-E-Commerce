"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { CartIcon, HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function TopProductCard({ product }: { product: ProductView }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[var(--color-line)]">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-alt)]">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </Link>

        {/* Discount Badge */}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
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
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 backdrop-blur shadow-md transition-all duration-200 hover:scale-110",
            wished ? "text-[var(--color-gold-dark)]" : "text-[var(--color-ink)]",
          )}
        >
          <HeartIcon className={cn("h-4 w-4", wished && "fill-[var(--color-gold)]")} />
        </button>

        {/* Quick Add to Cart — slides up on hover */}
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
          className="absolute inset-x-3 bottom-3 flex h-10 translate-y-3 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] text-[13px] font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:bg-[var(--color-ink-soft)] disabled:cursor-not-allowed"
        >
          <CartIcon className="h-4 w-4" />
          {product.stock > 0 ? "Quick Add" : "Sold Out"}
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-dark)]">
          {product.categoryName}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-[15px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-gold-dark)] transition-colors duration-200"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[15px] font-bold text-[var(--color-ink)]">
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-[var(--color-ink-soft)] line-through">
              {formatPrice(product.compareAt!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TopProducts({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Best Sellers
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Top Products
          </h2>
          <div className="mt-3 h-px w-12 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Our most-loved products, chosen by thousands of happy customers.
          </p>
        </div>
        <Link
          href="/products?sort=rating"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-all duration-200 flex-shrink-0 self-start sm:self-auto"
        >
          View all
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

      {/* Products Grid — 4 per row on desktop */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <TopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
