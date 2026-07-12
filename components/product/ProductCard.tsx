"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { CartIcon, HeartIcon, EyeIcon, TruckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 75;

export function ProductCard({
  product,
  view = "grid",
  onQuickView,
}: {
  product: ProductView;
  view?: "grid" | "list";
  onQuickView?: (p: ProductView) => void;
}) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;
  const freeShip = product.price >= FREE_SHIP_THRESHOLD;
  const hoverImg = product.images[1] ?? product.images[0];

  const wishlistBtn = (
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
        "grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105",
        wished ? "text-[var(--color-gold-dark)]" : "text-ink",
      )}
    >
      <HeartIcon className={cn("h-4 w-4", wished && "fill-[var(--color-gold)]")} />
    </button>
  );

  const quickViewBtn = onQuickView && (
    <button
      type="button"
      onClick={() => onQuickView(product)}
      aria-label="Quick view"
      className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:scale-105"
    >
      <EyeIcon className="h-4 w-4" />
    </button>
  );

  const badges = (
    <>
      {onSale && (
        <span className="rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
          {discountPct}% OFF
        </span>
      )}
      {!inStock && (
        <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
          Sold out
        </span>
      )}
    </>
  );

  const priceBlock = (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-ink">{formatPrice(product.price)}</span>
      {onSale && (
        <span className="text-xs text-ink-soft line-through">{formatPrice(product.compareAt!)}</span>
      )}
    </div>
  );

  // ── List view ──
  if (view === "list") {
    return (
      <div className="group flex gap-5 rounded-2xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:p-4">
        <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl bg-surface-alt sm:w-44">
          <Link href={`/products/${product.slug}`} aria-label={product.name}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 128px, 176px"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">{badges}</div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-ink-soft">{product.categoryName}</p>
              <Link
                href={`/products/${product.slug}`}
                className="mt-0.5 block truncate text-base font-medium text-ink hover:text-[var(--color-gold-dark)]"
              >
                {product.name}
              </Link>
            </div>
            {wishlistBtn}
          </div>

          <div className="mt-1.5">
            <Rating value={product.rating} count={product.numReviews} />
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{product.description}</p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div>
              {priceBlock}
              <p className="mt-1 text-xs font-medium">
                {inStock ? (
                  lowStock ? (
                    <span className="text-amber-600">Only {product.stock} left</span>
                  ) : (
                    <span className="text-emerald-600">In stock</span>
                  )
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
                {freeShip && inStock && (
                  <span className="ml-2 inline-flex items-center gap-1 text-ink-soft">
                    <TruckIcon className="h-3.5 w-3.5 text-[var(--color-gold-dark)]" /> Free shipping
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {quickViewBtn}
              <button
                type="button"
                disabled={!inStock}
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
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] transition hover:bg-[var(--color-gold-dark)] disabled:bg-ink-soft/50 disabled:shadow-none"
              >
                <CartIcon className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid view ──
  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface-alt">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={hoverImg}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">{badges}</div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {wishlistBtn}
          {quickViewBtn}
        </div>

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
          disabled={!inStock}
          className="absolute inset-x-3 bottom-3 flex h-10 translate-y-3 items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] text-sm font-medium text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[var(--color-gold-dark)] disabled:bg-ink-soft/60 disabled:shadow-none"
        >
          <CartIcon className="h-4 w-4" />
          {inStock ? "Add to cart" : "Sold out"}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-wider text-ink-soft">{product.categoryName}</p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-sm font-medium text-ink hover:text-[var(--color-gold-dark)]"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="mt-1 flex items-center justify-between gap-2">
          {priceBlock}
          {freeShip && inStock && (
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-soft">
              <TruckIcon className="h-3.5 w-3.5 text-[var(--color-gold-dark)]" /> Free ship
            </span>
          )}
        </div>
        {inStock ? (
          lowStock && <p className="text-[11px] font-medium text-amber-600">Only {product.stock} left</p>
        ) : (
          <p className="text-[11px] font-medium text-red-500">Out of stock</p>
        )}
      </div>
    </div>
  );
}
