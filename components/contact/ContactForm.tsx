"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStatus({ ok: true, text: data.message });
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus({ ok: false, text: data.error ?? "Could not send your message." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {status && (
        <p
          className={
            "rounded-xl border px-4 py-3 text-sm " +
            (status.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700")
          }
        >
          {status.text}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => set("name", v)} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
      </div>
      <Field label="Subject" value={form.subject} onChange={(v) => set("subject", v)} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Message</span>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
          rows={5}
          className="rounded-xl border border-line bg-white px-4 py-3 text-sm focus:border-[var(--color-gold)] focus:outline-none"
        />
      </label>
      <div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:border-[var(--color-gold)] focus:outline-none"
      />
    </label>
  );
}
