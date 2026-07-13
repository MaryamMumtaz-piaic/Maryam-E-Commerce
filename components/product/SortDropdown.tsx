"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { SortKey } from "@/lib/shop";
import { SORTS } from "@/lib/shop";

// ── Per-option icon glyphs ────────────────────────────────────────────────────

function IconNewest() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 1.5" />
    </svg>
  );
}

function IconPriceAsc() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12V4M3 4l2.5 2.5M3 4 .5 6.5" />
      <path d="M7 12h6M7 8.5h4.5M7 5h3" />
    </svg>
  );
}

function IconPriceDesc() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 4v8M3 12l2.5-2.5M3 12l-2.5-2.5" />
      <path d="M7 5h6M7 8.5h4.5M7 12h3" />
    </svg>
  );
}

function IconRating() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
      <path
        d="M8 1.5l1.65 3.34 3.69.54-2.67 2.6.63 3.68L8 9.77l-3.3 1.74.63-3.68-2.67-2.6 3.69-.54z"
        stroke="currentColor" strokeWidth={1} strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 2.8l1.2 2.4 2.65.39-1.92 1.87.45 2.65L8 8.94l-2.38 1.17.45-2.65-1.92-1.87 2.65-.4z"
        fill="currentColor" opacity="0.25"
      />
    </svg>
  );
}

function IconBestSelling() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12L5.5 8 8.5 10 13 5" />
      <path d="M10.5 5H13v2.5" />
    </svg>
  );
}

function IconFeatured() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14" />
      <path d="M4.1 4.1l1.05 1.05M10.85 10.85l1.05 1.05M10.85 5.15l1.05-1.05M4.1 11.9l1.05-1.05" />
      <circle cx="8" cy="8" r="2.5" />
    </svg>
  );
}

const SORT_ICONS: Record<SortKey, React.ReactNode> = {
  newest: <IconNewest />,
  "price-asc": <IconPriceAsc />,
  "price-desc": <IconPriceDesc />,
  rating: <IconRating />,
};

// ── Chevron animation ─────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "h-3.5 w-3.5 shrink-0 text-ink-soft transition-transform duration-250 ease-out",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

// ── Checkmark ────────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = SORTS.find((s) => s.value === value) ?? SORTS[0];

  // ── Outside click ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusIdx(SORTS.findIndex((s) => s.value === value));
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((i) => Math.min(i + 1, SORTS.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusIdx >= 0) {
          onChange(SORTS[focusIdx].value);
          setOpen(false);
          btnRef.current?.focus();
        }
      } else if (e.key === "Tab") {
        setOpen(false);
      }
    },
    [open, focusIdx, value, onChange],
  );

  // ── Focus the highlighted item ─────────────────────────────────────────────
  useEffect(() => {
    if (!open || focusIdx < 0) return;
    const item = listRef.current?.children[focusIdx] as HTMLElement | undefined;
    item?.focus();
  }, [open, focusIdx]);

  const select = (v: SortKey) => {
    onChange(v);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative shrink-0" onKeyDown={onKeyDown}>
      {/* ── Trigger button ── */}
      <button
        ref={btnRef}
        type="button"
        id="sort-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="sort-list"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) setFocusIdx(SORTS.findIndex((s) => s.value === value));
        }}
        className={cn(
          "group inline-flex h-8 items-center gap-2 rounded-lg border bg-white pl-3 pr-2.5 text-xs font-medium transition-all duration-200",
          open
            ? "border-[var(--color-gold)]/60 shadow-[0_0_0_3px_rgba(200,162,75,0.10)] text-ink"
            : "border-line text-ink-soft hover:border-[var(--color-gold)]/40 hover:text-ink hover:shadow-sm",
        )}
      >
        {/* Current sort icon */}
        <span className={cn(
          "transition-colors duration-200",
          open ? "text-[var(--color-gold-dark)]" : "text-ink-soft group-hover:text-[var(--color-gold-dark)]"
        )}>
          {SORT_ICONS[value]}
        </span>

        {/* Label */}
        <span className="hidden sm:inline whitespace-nowrap">
          Sort: <span className="font-semibold text-ink">{selected.label}</span>
        </span>
        <span className="sm:hidden whitespace-nowrap font-semibold text-ink">{selected.label}</span>

        <Chevron open={open} />
      </button>

      {/* ── Dropdown panel ── */}
      <div
        role="presentation"
        className={cn(
          // Base
          "absolute right-0 top-full z-[60] mt-2 w-52 origin-top-right",
          "rounded-xl border border-line bg-white",
          "shadow-[0_8px_30px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]",
          // Animation
          "transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 -translate-y-1",
        )}
      >
        {/* Panel header */}
        <div className="border-b border-line px-4 pb-2.5 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-dark)]">
            Sort by
          </p>
        </div>

        {/* Options list */}
        <ul
          ref={listRef}
          id="sort-list"
          role="listbox"
          aria-labelledby="sort-btn"
          aria-activedescendant={open ? `sort-opt-${value}` : undefined}
          className="p-1.5"
        >
          {SORTS.map((s, i) => {
            const isSelected = s.value === value;
            return (
              <li
                key={s.value}
                id={`sort-opt-${s.value}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={open ? 0 : -1}
                onClick={() => select(s.value)}
                onFocus={() => setFocusIdx(i)}
                className={cn(
                  // Base layout
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-xs transition-all duration-150 outline-none",
                  // Selected
                  isSelected
                    ? "bg-[var(--color-gold-soft)] text-ink"
                    : "text-ink-soft hover:bg-surface-alt hover:text-ink focus:bg-surface-alt focus:text-ink",
                )}
              >
                {/* Icon */}
                <span className={cn(
                  "transition-colors duration-150",
                  isSelected ? "text-[var(--color-gold-dark)]" : "text-ink-soft",
                )}>
                  {SORT_ICONS[s.value]}
                </span>

                {/* Label */}
                <span className={cn(
                  "flex-1 font-medium leading-none tracking-[0.01em]",
                  isSelected && "text-ink",
                )}>
                  {s.label}
                </span>

                {/* Checkmark */}
                {isSelected && <Check />}
              </li>
            );
          })}
        </ul>

        {/* Panel footer accent line */}
        <div className="h-px mx-3 mb-1.5 rounded-full bg-[linear-gradient(90deg,transparent,var(--color-gold)/30,transparent)]" />
      </div>
    </div>
  );
}
