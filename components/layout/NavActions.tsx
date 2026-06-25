"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { CartIcon, HeartIcon } from "@/components/ui/icons";

function Badge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function NavActions() {
  const [mounted, setMounted] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.items.length);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-surface-alt"
      >
        <HeartIcon className="h-5 w-5" />
        {mounted && <Badge value={wishCount} />}
      </Link>
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-surface-alt"
      >
        <CartIcon className="h-5 w-5" />
        {mounted && <Badge value={cartCount} />}
      </Link>
    </div>
  );
}
