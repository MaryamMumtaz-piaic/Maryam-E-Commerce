"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ProfileForm({
  initialName,
  email,
  role,
}: {
  initialName: string;
  email: string;
  role: string;
}) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    setMessage(res.ok ? "Profile updated." : "Could not update profile.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface-alt p-5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-gold-soft)] text-xl font-semibold text-[var(--color-gold-dark)]">
          {(name || email).charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{name || "Your name"}</p>
          <p className="text-xs text-ink-soft">{email}</p>
          {role === "ADMIN" && (
            <span className="mt-1 inline-block rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Admin
            </span>
          )}
        </div>
      </div>

      {message && (
        <p className="rounded-xl border border-line bg-surface-alt px-4 py-3 text-sm text-ink">{message}</p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          value={email}
          disabled
          className="h-11 cursor-not-allowed rounded-xl border border-line bg-surface-alt px-4 text-sm text-ink-soft"
        />
      </label>

      <div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
