"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { SearchIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      router.push(`/products?search=${encodeURIComponent(term)}`);
    } else {
      router.push("/products");
    }
  }

  // Handle outside click to collapse
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  // Keyboard shortcuts (Escape to close, "/" to open)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && expanded) {
        setExpanded(false);
        inputRef.current?.blur();
      }
      if (e.key === "/" && !expanded) {
        const active = document.activeElement;
        const isInputField =
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.getAttribute("contenteditable") === "true");

        if (!isInputField) {
          e.preventDefault();
          setExpanded(true);
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  // Auto-focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  return (
    <div ref={containerRef} className={cn("relative flex items-center justify-end", className)}>
      {/* Search Icon Trigger */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Search products"
          className="group flex h-10 w-10 items-center justify-center rounded-full text-ink transition duration-200 hover:bg-surface-alt hover:text-[var(--color-gold-dark)]"
        >
          <SearchIcon className="h-5.5 w-5.5 transition-transform duration-300 ease-out group-hover:scale-110" />
        </button>
      )}

      {/* Expanded search input container */}
      <form
        onSubmit={submit}
        className={cn(
          "flex items-center overflow-hidden transition-all duration-300 ease-out",
          expanded ? "w-40 xs:w-48 sm:w-64 opacity-100" : "w-0 opacity-0"
        )}
      >
        <div className="relative w-full">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-10 w-full rounded-full border border-line bg-surface-alt pl-9 pr-8 text-xs text-ink placeholder:text-ink-soft transition-all duration-200 focus:border-[var(--color-gold)]/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--color-gold)]/5"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Close search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
