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

export function ProductCard({ product }: { product: ProductView }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  const onSale = product.compareAt != null && product.compareAt > product.price;
  const discountPct = onSale
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface-alt">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
            {discountPct}% OFF
          </span>
        )}

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
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-105",
            wished ? "text-[var(--color-gold-dark)]" : "text-ink",
          )}
        >
          <HeartIcon className={cn("h-4.5 w-4.5", wished && "fill-[var(--color-gold)]")} />
        </button>

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
          className="absolute inset-x-3 bottom-3 flex h-10 translate-y-3 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:bg-ink-soft"
        >
          <CartIcon className="h-4 w-4" />
          {product.stock > 0 ? "Add to cart" : "Sold out"}
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
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-xs text-ink-soft line-through">
              {formatPrice(product.compareAt!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
