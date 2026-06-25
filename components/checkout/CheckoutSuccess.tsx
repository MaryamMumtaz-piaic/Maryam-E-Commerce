"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/store/cart";
import { ButtonLink } from "@/components/ui/Button";

export function CheckoutSuccess({ orderId }: { orderId?: string }) {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <h1 className="mt-6 font-serif text-3xl tracking-tight">Order confirmed</h1>
      <p className="mt-3 text-ink-soft">
        Thank you for your purchase. A confirmation has been sent to your email.
      </p>
      {orderId && (
        <p className="mt-2 text-sm text-ink-soft">
          Order reference: <span className="font-mono text-ink">{orderId.slice(0, 8).toUpperCase()}</span>
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/orders" variant="outline">View orders</ButtonLink>
        <ButtonLink href="/products">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}
