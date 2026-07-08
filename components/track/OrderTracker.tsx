"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckIcon, TruckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Order Placed", detail: "We've received your order and payment." },
  { label: "Packed", detail: "Your items are picked and carefully packed." },
  { label: "Shipped", detail: "Your parcel is on its way to your local hub." },
  { label: "Out for Delivery", detail: "Your parcel is out with the courier today." },
  { label: "Delivered", detail: "Your order has arrived. Enjoy!" },
];

export function OrderTracker() {
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [tracked, setTracked] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Front-end only — shows a representative timeline for any valid-looking input.
    setTracked(true);
  }

  // Mock: parcel is currently "Out for Delivery" (index 3).
  const currentStep = 3;

  return (
    <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
      <form
        onSubmit={onSubmit}
        className="flex h-fit flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6"
      >
        <h2 className="font-serif text-xl">Track your order</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Order number</span>
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
            placeholder="e.g. MRY-100294"
            className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
          />
        </label>
        <Button type="submit" size="lg">
          Track order
        </Button>
      </form>

      <div>
        {tracked ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-line pb-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
                <TruckIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-ink-soft">Order {order || "MRY-100294"}</p>
                <p className="font-serif text-lg text-ink">Out for delivery — arriving today</p>
              </div>
            </div>

            <ol className="relative flex flex-col gap-6">
              {STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <li key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border-2 transition-colors",
                          done && "border-[var(--color-gold)] bg-[var(--color-gold)] text-white",
                          active && "border-[var(--color-gold)] bg-white text-[var(--color-gold-dark)]",
                          !done && !active && "border-line bg-white text-ink-soft",
                        )}
                      >
                        {done ? <CheckIcon className="h-4 w-4" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span className={cn("mt-1 h-full w-0.5 flex-1", done ? "bg-[var(--color-gold)]" : "bg-line")} />
                      )}
                    </div>
                    <div className={cn("pb-2", active && "font-medium")}>
                      <p className={cn("text-sm", active ? "text-ink" : done ? "text-ink" : "text-ink-soft")}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-soft">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line bg-surface-alt p-8 text-center">
            <TruckIcon className="h-10 w-10 text-ink-soft" />
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Enter your order number and email to see the latest status of your delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
