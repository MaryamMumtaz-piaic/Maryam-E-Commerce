"use client";

import { useMemo, useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import type { CategoryView } from "@/lib/types";
import type { Filters, FacetIndex, CollectionKey } from "@/lib/shop";
import { RATING_OPTIONS, DISCOUNT_OPTIONS, CONDITIONS, SHIPPING_OPTIONS, COLLECTIONS } from "@/lib/shop";
import { Rating } from "@/components/ui/Rating";
import { ChevronDown, SearchIcon, CheckIcon } from "@/components/ui/icons";

const COLOR_HEX: Record<string, string> = {
  Black: "#1c1c1c",
  White: "#f4f4f2",
  Grey: "#9a9a9a",
  Beige: "#d8c6aa",
  Navy: "#2a3a5e",
  Brown: "#7b5535",
  Green: "#4f6b52",
  Gold: "#c8a24b",
};

export function ShopFilters({
  categories,
  filters,
  facets,
  bounds,
  activeCount,
  onChange,
  onReset,
}: {
  categories: CategoryView[];
  filters: Filters;
  facets: FacetIndex;
  bounds: { min: number; max: number };
  activeCount: number;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const [brandQuery, setBrandQuery] = useState("");

  const shownBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    return q ? facets.brands.filter((b) => b.toLowerCase().includes(q)) : facets.brands;
  }, [facets.brands, brandQuery]);

  const toggle = (list: string[], value: string, key: keyof Filters) => {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ [key]: next } as Partial<Filters>);
  };

  const toggleCollection = (key: CollectionKey) => {
    const next = filters.collections.includes(key)
      ? filters.collections.filter((c) => c !== key)
      : [...filters.collections, key];
    onChange({ collections: next });
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">Filters</h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-[var(--color-gold-dark)] transition hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Quick collections */}
      <Collapsible title="Collections" defaultOpen>
        <div className="flex flex-col gap-0.5">
          {COLLECTIONS.map((c) => (
            <CheckRow
              key={c.key}
              checked={filters.collections.includes(c.key)}
              onToggle={() => toggleCollection(c.key)}
              label={c.label}
            />
          ))}
        </div>
      </Collapsible>

      {/* Categories */}
      <Collapsible title="Categories" defaultOpen>
        <ul className="flex flex-col gap-0.5">
          <li>
            <FilterRadio
              checked={!filters.category}
              onClick={() => onChange({ category: null })}
              label="All products"
            />
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <FilterRadio
                checked={filters.category === c.slug}
                onClick={() => onChange({ category: c.slug })}
                label={c.name}
                count={c.productCount}
              />
            </li>
          ))}
        </ul>
      </Collapsible>

      {/* Brand */}
      {facets.brands.length > 0 && (
        <Collapsible title="Brand" defaultOpen>
          {facets.brands.length > 6 && (
            <div className="relative mb-2.5">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" />
              <input
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder="Search brands"
                className="h-8 w-full rounded-lg border border-line bg-surface-alt pl-8 pr-2 text-xs text-ink placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:bg-white focus:outline-none"
              />
            </div>
          )}
          <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto pr-1">
            {shownBrands.map((b) => (
              <CheckRow
                key={b}
                checked={filters.brands.includes(b)}
                onToggle={() => toggle(filters.brands, b, "brands")}
                label={b}
              />
            ))}
            {shownBrands.length === 0 && (
              <p className="px-2.5 py-2 text-xs text-ink-soft">No brands match.</p>
            )}
          </div>
        </Collapsible>
      )}

      {/* Price range */}
      <Collapsible title="Price range" defaultOpen>
        <div className="flex items-center justify-between text-sm text-ink">
          <span className="rounded-lg border border-line bg-surface-alt px-2.5 py-1 text-xs font-medium">
            {formatPrice(filters.priceMin)}
          </span>
          <span className="text-ink-soft">—</span>
          <span className="rounded-lg border border-line bg-surface-alt px-2.5 py-1 text-xs font-medium">
            {formatPrice(filters.priceMax)}
          </span>
        </div>
        <div className="relative mt-4 h-5">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--color-gold)]"
            style={{
              left: `${pct(filters.priceMin, bounds)}%`,
              right: `${100 - pct(filters.priceMax, bounds)}%`,
            }}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={filters.priceMin}
            onChange={(e) =>
              onChange({ priceMin: Math.min(Number(e.target.value), filters.priceMax) })
            }
            className="range-thumb absolute inset-x-0 top-0 h-5 w-full"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={filters.priceMax}
            onChange={(e) =>
              onChange({ priceMax: Math.max(Number(e.target.value), filters.priceMin) })
            }
            className="range-thumb absolute inset-x-0 top-0 h-5 w-full"
            aria-label="Maximum price"
          />
        </div>
      </Collapsible>

      {/* Size */}
      {facets.sizes.length > 0 && (
        <Collapsible title="Size" defaultOpen>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const active = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(filters.sizes, s, "sizes")}
                  aria-pressed={active}
                  className={cn(
                    "min-w-9 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-soft)] text-ink"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Collapsible>
      )}

      {/* Color */}
      {facets.colors.length > 0 && (
        <Collapsible title="Color" defaultOpen>
          <div className="flex flex-wrap gap-2.5">
            {facets.colors.map((c) => {
              const active = filters.colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggle(filters.colors, c.name, "colors")}
                  aria-pressed={active}
                  title={c.name}
                  className={cn(
                    "relative grid h-7 w-7 place-items-center rounded-full transition",
                    active
                      ? "ring-2 ring-[var(--color-gold)] ring-offset-2"
                      : "ring-1 ring-line hover:ring-ink/30",
                  )}
                >
                  <span
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: c.hex ?? COLOR_HEX[c.name] }}
                  />
                  {active && (
                    <CheckIcon
                      className={cn(
                        "absolute h-3.5 w-3.5",
                        c.name === "White" || c.name === "Beige" || c.name === "Gold"
                          ? "text-ink"
                          : "text-white",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Collapsible>
      )}

      {/* Material */}
      {facets.materials.length > 0 && (
        <Collapsible title="Material">
          <div className="flex flex-col gap-0.5">
            {facets.materials.map((m) => (
              <CheckRow
                key={m}
                checked={filters.materials.includes(m)}
                onToggle={() => toggle(filters.materials, m, "materials")}
                label={m}
              />
            ))}
          </div>
        </Collapsible>
      )}

      {/* Rating */}
      <Collapsible title="Customer rating" defaultOpen>
        <ul className="flex flex-col gap-0.5">
          {RATING_OPTIONS.map((r) => (
            <li key={r}>
              <button
                type="button"
                onClick={() => onChange({ minRating: filters.minRating === r ? 0 : r })}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition",
                  filters.minRating === r ? "bg-[var(--color-gold-soft)]" : "hover:bg-surface-alt",
                )}
              >
                <Rating value={r} />
                <span className="text-ink-soft">& up</span>
              </button>
            </li>
          ))}
        </ul>
      </Collapsible>

      {/* Discount */}
      <Collapsible title="Discount">
        <div className="flex flex-col gap-0.5">
          {DISCOUNT_OPTIONS.map((d) => (
            <FilterRadio
              key={d}
              checked={filters.minDiscount === d}
              onClick={() => onChange({ minDiscount: filters.minDiscount === d ? 0 : d })}
              label={`${d}% off or more`}
            />
          ))}
        </div>
      </Collapsible>

      {/* Availability */}
      <Collapsible title="Availability" defaultOpen>
        <CheckRow
          checked={filters.inStockOnly}
          onToggle={() => onChange({ inStockOnly: !filters.inStockOnly })}
          label="In stock"
        />
        <CheckRow
          checked={filters.onSaleOnly}
          onToggle={() => onChange({ onSaleOnly: !filters.onSaleOnly })}
          label="On sale / discounted"
        />
      </Collapsible>

      {/* Condition */}
      <Collapsible title="Condition">
        <div className="flex flex-col gap-0.5">
          {CONDITIONS.map((c) => (
            <CheckRow
              key={c}
              checked={filters.conditions.includes(c)}
              onToggle={() => toggle(filters.conditions, c, "conditions")}
              label={c}
            />
          ))}
        </div>
      </Collapsible>

      {/* Shipping */}
      <Collapsible title="Shipping">
        <div className="flex flex-col gap-0.5">
          {SHIPPING_OPTIONS.map((s) => (
            <CheckRow
              key={s}
              checked={filters.shipping.includes(s)}
              onToggle={() => toggle(filters.shipping, s, "shipping")}
              label={s}
            />
          ))}
        </div>
      </Collapsible>

      {/* Seller */}
      {facets.sellers.length > 0 && (
        <Collapsible title="Seller / Store">
          <div className="flex flex-col gap-0.5">
            {facets.sellers.map((s) => (
              <CheckRow
                key={s}
                checked={filters.sellers.includes(s)}
                onToggle={() => toggle(filters.sellers, s, "sellers")}
                label={s}
              />
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  );
}

function pct(value: number, bounds: { min: number; max: number }): number {
  if (bounds.max === bounds.min) return 0;
  return ((value - bounds.min) / (bounds.max - bounds.min)) * 100;
}

function Collapsible({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-line py-3.5 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-soft transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition",
        checked ? "bg-[var(--color-gold-soft)] font-medium text-ink" : "text-ink-soft hover:bg-surface-alt",
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded border transition",
          checked ? "border-[var(--color-gold)] bg-[var(--color-gold)]" : "border-line",
        )}
      >
        {checked && <CheckIcon className="h-3 w-3 text-white" />}
      </span>
      {label}
    </button>
  );
}

function FilterRadio({
  checked,
  onClick,
  label,
  count,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition",
        checked ? "bg-[var(--color-gold-soft)] font-medium text-ink" : "text-ink-soft hover:bg-surface-alt",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-3.5 w-3.5 place-items-center rounded-full border transition",
            checked ? "border-[var(--color-gold)]" : "border-line",
          )}
        >
          {checked && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />}
        </span>
        {label}
      </span>
      {count != null && <span className="text-xs text-ink-soft">{count}</span>}
    </button>
  );
}
