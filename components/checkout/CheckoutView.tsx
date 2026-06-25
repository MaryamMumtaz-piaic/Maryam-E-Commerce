"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/ui/icons";

export function CheckoutView({
  defaultEmail,
  defaultName,
}: {
  defaultEmail: string;
  defaultName: string;
}) {
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line py-20 text-center">
        <p className="text-ink-soft">Your cart is empty.</p>
        <div className="mt-6">
          <ButtonLink href="/products">Browse products</ButtonLink>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 75 ? 0 : 8;
  const total = subtotal + shipping;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={pay} className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-[var(--radius-card)] border border-line p-6">
          <h2 className="font-serif text-xl">Contact & shipping</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={name} onChange={setName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <div className="sm:col-span-2">
              <Field label="Shipping address" value={address} onChange={setAddress} placeholder="Street, city, postal code, country" />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[var(--radius-card)] border border-line p-6">
          <h2 className="font-serif text-xl">Payment</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
            <ShieldIcon className="h-4.5 w-4.5 text-[var(--color-gold-dark)]" />
            You&apos;ll be redirected to Stripe&apos;s secure checkout to complete payment.
          </p>
          <p className="mt-3 rounded-xl border border-line bg-surface-alt px-4 py-2.5 text-xs text-ink-soft">
            Test card: 4242 4242 4242 4242 · any future expiry · any CVC. If Stripe
            keys aren&apos;t set, checkout completes in demo mode.
          </p>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
          <h2 className="font-serif text-xl">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
                </span>
                <span className="flex-1 text-sm text-ink">{i.name}</span>
                <span className="text-xs text-ink-soft">×{i.quantity}</span>
                <span className="text-sm font-medium text-ink">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2.5 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>

          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

          <div className="mt-6">
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? "Redirecting…" : `Pay ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
      />
    </label>
  );
}
