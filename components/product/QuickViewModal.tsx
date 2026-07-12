"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { CartIcon, HeartIcon, CloseIcon, TruckIcon, ShieldIcon } from "@/components/ui/icons";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductView | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => (product ? s.items.some((i) => i.id === product.id) : false));

  useEffect(() => setMounted(true), []);
  useEffect(() => setActive(0), [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!mounted || !product) return null;

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;
  const inStock = product.stock > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div
        className="animate-auth-in relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:flex-row sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* Image */}
        <div className="relative w-full bg-surface-alt sm:w-1/2">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[active] ?? product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
            {onSale && (
              <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                {discountPct}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 px-4 py-3">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative h-12 w-12 overflow-hidden rounded-lg border transition",
                    i === active ? "border-[var(--color-gold)]" : "border-line opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex w-full flex-col overflow-y-auto p-6 sm:w-1/2 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-dark)]">
            {product.categoryName}
          </p>
          <h2 className="mt-1.5 font-serif text-2xl leading-tight tracking-tight text-ink">
            {product.name}
          </h2>
          <div className="mt-2.5">
            <Rating value={product.rating} count={product.numReviews} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-base text-ink-soft line-through">
                {formatPrice(product.compareAt!)}
              </span>
            )}
          </div>

          <p className="mt-3 text-[13px] font-medium">
            {inStock ? (
              <span className="text-emerald-600">In stock — {product.stock} available</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-6 flex gap-3">
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
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] text-sm font-medium text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] transition hover:bg-[var(--color-gold-dark)] disabled:bg-ink-soft/50 disabled:shadow-none"
            >
              <CartIcon className="h-4 w-4" />
              {inStock ? "Add to cart" : "Sold out"}
            </button>
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
                "grid h-12 w-12 place-items-center rounded-full border border-line transition hover:bg-surface-alt",
                wished ? "text-[var(--color-gold-dark)]" : "text-ink",
              )}
            >
              <HeartIcon className={cn("h-5 w-5", wished && "fill-[var(--color-gold)]")} />
            </button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="mt-3 text-center text-sm font-medium text-[var(--color-gold-dark)] hover:underline"
          >
            View full details
          </Link>

          <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-xs text-ink-soft">
            <span className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-[var(--color-gold-dark)]" />
              Free shipping over $75
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-[var(--color-gold-dark)]" />
              Secure checkout & easy returns
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
