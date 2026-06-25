"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function SearchBar({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
  }

  return (
    <form onSubmit={submit} className={cn("relative w-full", className)} role="search">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-surface-alt pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:bg-white focus:outline-none"
      />
    </form>
  );
}
