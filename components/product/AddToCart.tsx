"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { Button } from "@/components/ui/Button";
import { CartIcon, HeartIcon } from "@/components/ui/icons";
import type { ProductView } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: ProductView }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;

  function handleAdd() {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-11 w-11 place-items-center rounded-full text-lg text-ink hover:bg-surface-alt"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="grid h-11 w-11 place-items-center rounded-full text-lg text-ink hover:bg-surface-alt"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-sm text-ink-soft">
          {soldOut ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleAdd}
          disabled={soldOut}
          size="lg"
          className="flex-1"
          variant={added ? "gold" : "primary"}
        >
          <CartIcon className="h-5 w-5" />
          {added ? "Added to cart" : soldOut ? "Sold out" : "Add to cart"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            toggle({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
            })
          }
          aria-label="Toggle wishlist"
          className="px-5"
        >
          <HeartIcon className={cn("h-5 w-5", wished && "fill-[var(--color-gold)] text-[var(--color-gold-dark)]")} />
        </Button>
      </div>
    </div>
  );
}
