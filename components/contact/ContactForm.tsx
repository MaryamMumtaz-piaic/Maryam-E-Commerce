"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CheckIcon, CloseIcon, ChevronDown } from "@/components/ui/icons";

const SUBJECTS = [
  "Order support",
  "Product question",
  "Returns & exchanges",
  "Partnership",
  "Something else",
];

const MAX_MESSAGE = 1000;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [company, setCompany] = useState(""); // honeypot — real users leave this blank
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company) return; // bot filled the honeypot; silently drop
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, text: data.message });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ ok: false, text: data.error ?? "Could not send your message." });
      }
    } catch {
      setStatus({ ok: false, text: "Network error — please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-8"
    >
      <div>
        <h2 className="font-serif text-2xl text-ink">Send us a message</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Fill in the form and our team will reply within 1–2 business days.
        </p>
      </div>

      {status && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
            status.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          <span
            className={cn(
              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white",
              status.ok ? "bg-green-600" : "bg-red-600",
            )}
          >
            {status.ok ? <CheckIcon className="h-3.5 w-3.5" /> : <CloseIcon className="h-3.5 w-3.5" />}
          </span>
          {status.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => set("name", v)} placeholder="Your full name" required />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          placeholder="you@example.com"
          required
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Subject</span>
        <div className="relative">
          <select
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border border-line bg-white px-4 pr-10 text-sm focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-soft)]",
              !form.subject && "text-ink-soft",
            )}
          >
            <option value="">Choose a topic…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="text-ink">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">Message</span>
          <span className="text-xs text-ink-soft">
            {form.message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value.slice(0, MAX_MESSAGE))}
          required
          rows={6}
          placeholder="How can we help?"
          className="resize-y rounded-xl border border-line bg-white px-4 py-3 text-sm placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-soft)]"
        />
      </label>

      {/* Honeypot: hidden from users, tempting to bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="gold" size="lg" disabled={loading}>
          {loading ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-ink-soft">We respect your privacy. No spam, ever.</p>
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
        className="h-11 rounded-xl border border-line bg-white px-4 text-sm placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-soft)]"
      />
    </label>
  );
}
