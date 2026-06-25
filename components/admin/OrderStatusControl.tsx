"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PROCESSING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  async function update(next: string) {
    setStatus(next);
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => update(e.target.value)}
      className="h-9 rounded-full border border-line bg-white px-3 text-xs font-medium text-ink focus:border-[var(--color-gold)] focus:outline-none disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
