"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

// Upgraded modern 2026 e-commerce icons (clean, elegant, minimalist)
function ModernWishlistIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ModernCartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function Badge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-white ring-2 ring-white animate-fade-in">
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
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Wishlist Link with Premium Tooltip */}
      <div className="group relative">
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-200 hover:bg-surface-alt hover:text-[var(--color-gold-dark)]"
        >
          <ModernWishlistIcon className="h-5.5 w-5.5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5" />
          {mounted && <Badge value={wishCount} />}
        </Link>
        {/* Tooltip */}
        <span className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 scale-90 rounded-md bg-ink px-2.5 py-1 text-[10px] font-medium tracking-wide text-white opacity-0 shadow-md transition-all duration-200 ease-out group-hover:translate-y-1 group-hover:scale-100 group-hover:opacity-100">
          Wishlist
        </span>
      </div>

      {/* Cart Link with Premium Tooltip */}
      <div className="group relative">
        <Link
          href="/cart"
          aria-label="Cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-200 hover:bg-surface-alt hover:text-[var(--color-gold-dark)]"
        >
          <ModernCartIcon className="h-5.5 w-5.5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5" />
          {mounted && <Badge value={cartCount} />}
        </Link>
        {/* Tooltip */}
        <span className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 scale-90 rounded-md bg-ink px-2.5 py-1 text-[10px] font-medium tracking-wide text-white opacity-0 shadow-md transition-all duration-200 ease-out group-hover:translate-y-1 group-hover:scale-100 group-hover:opacity-100">
          Cart
        </span>
      </div>
    </div>
  );
}
