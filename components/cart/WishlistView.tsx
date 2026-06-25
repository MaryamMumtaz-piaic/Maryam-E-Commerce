"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/store/wishlist";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { HeartIcon, CartIcon, CloseIcon } from "@/components/ui/icons";

export function WishlistView() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-alt text-ink-soft">
          <HeartIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-medium text-ink">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-ink-soft">Save pieces you love for later.</p>
        <div className="mt-6">
          <ButtonLink href="/products">Explore products</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="group relative flex flex-col rounded-[var(--radius-card)] border border-line p-3">
          <Link
            href={`/products/${item.slug}`}
            className="relative aspect-square overflow-hidden rounded-xl bg-surface-alt"
          >
            <Image src={item.image} alt={item.name} fill sizes="33vw" className="object-cover" />
          </Link>
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label="Remove"
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink backdrop-blur hover:bg-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <div className="mt-3 flex flex-1 flex-col">
            <Link href={`/products/${item.slug}`} className="text-sm font-medium text-ink hover:text-[var(--color-gold-dark)]">
              {item.name}
            </Link>
            <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(item.price)}</p>
            <div className="mt-3">
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  add({ id: item.id, slug: item.slug, name: item.name, price: item.price, image: item.image, stock: 99 });
                  remove(item.id);
                }}
              >
                <CartIcon className="h-4 w-4" /> Move to cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
