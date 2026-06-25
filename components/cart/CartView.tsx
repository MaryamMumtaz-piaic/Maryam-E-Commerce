"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { CartIcon, CloseIcon } from "@/components/ui/icons";

export function CartView() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-alt text-ink-soft">
          <CartIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-medium text-ink">Your cart is empty</p>
        <p className="mt-1 text-sm text-ink-soft">Discover something you love.</p>
        <div className="mt-6">
          <ButtonLink href="/products">Start shopping</ButtonLink>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 75 ? 0 : 8;
  const total = subtotal + shipping;

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="flex flex-col divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt"
              >
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/products/${item.slug}`} className="text-sm font-medium text-ink hover:text-[var(--color-gold-dark)]">
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label="Remove"
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-soft hover:bg-surface-alt hover:text-ink"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.quantity - 1)}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-surface-alt"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.quantity + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-surface-alt"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
          <h2 className="font-serif text-xl">Order summary</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <div className="border-t border-line pt-3">
              <Row label="Total" value={formatPrice(total)} bold />
            </div>
          </dl>
          {shipping > 0 && (
            <p className="mt-3 text-xs text-ink-soft">
              Add {formatPrice(75 - subtotal)} more for free shipping.
            </p>
          )}
          <div className="mt-6">
            <ButtonLink href="/checkout" size="lg" className="w-full">
              Proceed to checkout
            </ButtonLink>
          </div>
          <Link href="/products" className="mt-3 block text-center text-sm text-ink-soft hover:text-ink">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-ink" : "text-ink-soft"}>{label}</dt>
      <dd className={bold ? "text-base font-semibold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
