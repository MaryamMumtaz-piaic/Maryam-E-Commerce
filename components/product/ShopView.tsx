"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryView, ProductView } from "@/lib/types";
import {
  type Filters,
  type SortKey,
  type CollectionKey,
  SORTS,
  COLLECTIONS,
  applyFilters,
  sortProducts,
  priceBounds,
  defaultFilters,
  countActiveFilters,
  buildFacetIndex,
} from "@/lib/shop";
import { formatPrice, cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { ShopFilters } from "./ShopFilters";
import { QuickViewModal } from "./QuickViewModal";
import { RecentlyViewed } from "./RecentlyViewed";
import { SortDropdown } from "./SortDropdown";
import {
  SearchIcon,
  CloseIcon,
} from "@/components/ui/icons";

const BATCH = 12;

export function ShopView({
  products,
  categories,
  lockedCategory,
}: {
  products: ProductView[];
  categories: CategoryView[];
  /** When set (category page), the category filter is fixed and hidden from chips. */
  lockedCategory?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const bounds = useMemo(() => priceBounds(products), [products]);
  const facets = useMemo(() => buildFacetIndex(products), [products]);

  // ── Initialize state from URL (persists on refresh, shareable) ──
  const [filters, setFilters] = useState<Filters>(() => readFilters(params, bounds, lockedCategory));
  const [sort, setSort] = useState<SortKey>(() => (params.get("sort") as SortKey) ?? "newest");
  const [searchInput, setSearchInput] = useState(() => params.get("search") ?? "");
  const [view, setView] = useState<"grid" | "list">("grid");
  // Desktop sidebar: visible by default, can be collapsed
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(BATCH);
  const [quickView, setQuickView] = useState<ProductView | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // Expandable search bar state
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHydrated(true), []);

  const activeCount = countActiveFilters(filters, bounds);

  // ── Derived list ──
  const filtered = useMemo(
    () => sortProducts(applyFilters(products, filters, bounds), sort),
    [products, filters, bounds, sort],
  );

  // Reset the visible window whenever the result set changes.
  useEffect(() => setVisible(BATCH), [filters, sort]);

  // ── Sync state → URL (replace, no scroll jump) ──
  useEffect(() => {
    if (!hydrated) return;
    const sp = new URLSearchParams();
    if (!lockedCategory && filters.category) sp.set("category", filters.category);
    if (filters.brands.length) sp.set("brand", filters.brands.join(","));
    if (filters.priceMin > bounds.min) sp.set("min", String(filters.priceMin));
    if (filters.priceMax < bounds.max) sp.set("max", String(filters.priceMax));
    if (filters.sizes.length) sp.set("size", filters.sizes.join(","));
    if (filters.colors.length) sp.set("color", filters.colors.join(","));
    if (filters.materials.length) sp.set("material", filters.materials.join(","));
    if (filters.minRating > 0) sp.set("rating", String(filters.minRating));
    if (filters.minDiscount > 0) sp.set("discount", String(filters.minDiscount));
    if (filters.inStockOnly) sp.set("stock", "1");
    if (filters.onSaleOnly) sp.set("sale", "1");
    if (filters.conditions.length) sp.set("condition", filters.conditions.join(","));
    if (filters.shipping.length) sp.set("shipping", filters.shipping.join(","));
    if (filters.sellers.length) sp.set("seller", filters.sellers.join(","));
    if (filters.collections.length) sp.set("collection", filters.collections.join(","));
    if (filters.search) sp.set("search", filters.search);
    if (sort !== "newest") sp.set("sort", sort);
    const qs = sp.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [filters, sort, hydrated, bounds, lockedCategory, router]);

  // ── Debounce the search box into filters ──
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: searchInput.trim() })), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Collapse search on outside click ──
  useEffect(() => {
    if (!searchExpanded) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchExpanded]);

  // Auto-focus the input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // ── Infinite scroll ──
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + BATCH, filtered.length));
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const update = useCallback((patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch })), []);

  const reset = useCallback(() => {
    const d = defaultFilters(bounds);
    if (lockedCategory) d.category = lockedCategory;
    setFilters(d);
    setSearchInput("");
    setSort("newest");
  }, [bounds, lockedCategory]);

  const shown = filtered.slice(0, visible);
  const chips = buildChips(filters, bounds, categories, lockedCategory);

  // Determine the grid column layout based on sidebar state
  const gridCols = sidebarOpen
    ? "lg:grid-cols-[260px_1fr]"
    : "lg:grid-cols-[0px_1fr]";

  return (
    <>
      <div className={cn("grid gap-6 lg:gap-8", sidebarOpen ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1")}>
        {/* ── Sidebar (desktop, sticky, collapsible) ── */}
        {sidebarOpen && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {/* Sidebar header with collapse button */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Filters</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Collapse filters"
                  className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-surface-alt hover:text-ink"
                >
                  {/* Left-pointing chevron to collapse */}
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <ShopFilters
                categories={categories}
                filters={filters}
                facets={facets}
                bounds={bounds}
                activeCount={activeCount}
                onChange={update}
                onReset={reset}
              />
            </div>
          </aside>
        )}

        {/* ── Main column ── */}
        <div className="min-w-0">
          {/* ── Compact single-row toolbar ── */}
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

            {/* Filter toggle (desktop – expand sidebar) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse filters" : "Expand filters"}
              className={cn(
                "hidden lg:inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition",
                sidebarOpen
                  ? "border-[var(--color-gold)]/40 bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]"
                  : "border-line text-ink-soft hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-gold-soft)] hover:text-[var(--color-gold-dark)]"
              )}
            >
              <FilterIcon />
              {sidebarOpen ? "Hide" : "Filters"}
              {activeCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Filter button (mobile) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open filters"
              className="inline-flex lg:hidden h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-medium text-ink-soft transition hover:bg-surface-alt"
            >
              <FilterIcon />
              Filters
              {activeCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-line" aria-hidden />

            {/* Product count */}
            <p className="shrink-0 text-xs text-ink-soft">
              <span className="font-semibold text-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
            </p>

            {/* Spacer */}
            <div className="flex-1" />

            {/* ── Expandable Search ── */}
            <div ref={searchRef} className="relative flex items-center">
              {/* Icon button — hidden when expanded */}
              {!searchExpanded && (
                <button
                  type="button"
                  onClick={() => setSearchExpanded(true)}
                  aria-label="Search products"
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-alt hover:text-ink"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
              )}

              {/* Expanding input */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-out",
                  searchExpanded ? "w-48 opacity-100 sm:w-64" : "w-0 opacity-0"
                )}
              >
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" />
                  <input
                    ref={searchInputRef}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search…"
                    aria-label="Search products"
                    className="h-8 w-full rounded-lg border border-[var(--color-gold)]/50 bg-surface-alt pl-8 pr-8 text-xs text-ink placeholder:text-ink-soft focus:border-[var(--color-gold)] focus:bg-white focus:outline-none"
                  />
                  {searchInput ? (
                    <button
                      type="button"
                      onClick={() => { setSearchInput(""); }}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSearchExpanded(false)}
                      aria-label="Close search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sort dropdown — premium custom component */}
            <SortDropdown value={sort} onChange={setSort} />

            {/* View toggle */}
            <div className="hidden shrink-0 items-center rounded-lg border border-line p-0.5 sm:flex">
              <ViewToggle active={view === "grid"} onClick={() => setView("grid")} label="Grid">
                <GridGlyph />
              </ViewToggle>
              <ViewToggle active={view === "list"} onClick={() => setView("list")} label="List">
                <ListGlyph />
              </ViewToggle>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => update(chip.clear)}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-ink transition hover:bg-[var(--color-gold-soft)]"
                >
                  {chip.label}
                  <CloseIcon className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="text-[11px] font-medium text-[var(--color-gold-dark)] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* ── Product Grid / List ── */}
          <div className="mt-3">
            {filtered.length === 0 ? (
              <EmptyState onReset={reset} />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} view="grid" onQuickView={setQuickView} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} view="list" onQuickView={setQuickView} />
                ))}
              </div>
            )}

            {/* Infinite-scroll sentinel */}
            {visible < filtered.length && (
              <div ref={sentinel} className="mt-8">
                <div
                  className={cn(
                    "grid gap-x-4 gap-y-7 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
                    view === "list" && "grid-cols-1 sm:grid-cols-1 xl:grid-cols-1",
                  )}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} list={view === "list"} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recently viewed */}
          <RecentlyViewed />
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl animate-drawer-in">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-serif text-lg text-ink">Filters</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-surface-alt"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ShopFilters
                categories={categories}
                filters={filters}
                facets={facets}
                bounds={bounds}
                activeCount={activeCount}
                onChange={update}
                onReset={reset}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="h-12 w-full rounded-full bg-[var(--color-gold)] text-sm font-medium text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] transition hover:bg-[var(--color-gold-dark)]"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

// ── Helpers ──

function readFilters(
  params: URLSearchParams,
  bounds: { min: number; max: number },
  lockedCategory?: string,
): Filters {
  const d = defaultFilters(bounds);
  return {
    category: lockedCategory ?? params.get("category") ?? d.category,
    brands: splitList(params.get("brand")),
    priceMin: clampNum(params.get("min"), bounds.min, bounds.min, bounds.max),
    priceMax: clampNum(params.get("max"), bounds.max, bounds.min, bounds.max),
    sizes: splitList(params.get("size")),
    colors: splitList(params.get("color")),
    materials: splitList(params.get("material")),
    minRating: Number(params.get("rating")) || 0,
    minDiscount: Number(params.get("discount")) || 0,
    inStockOnly: params.get("stock") === "1",
    onSaleOnly: params.get("sale") === "1",
    conditions: splitList(params.get("condition")),
    shipping: splitList(params.get("shipping")),
    sellers: splitList(params.get("seller")),
    collections: splitList(params.get("collection")) as CollectionKey[],
    search: params.get("search") ?? "",
  };
}

function splitList(raw: string | null): string[] {
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function clampNum(raw: string | null, fallback: number, min: number, max: number): number {
  const n = raw == null ? NaN : Number(raw);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

type Chip = { key: string; label: string; clear: Partial<Filters> };

function buildChips(
  f: Filters,
  bounds: { min: number; max: number },
  categories: CategoryView[],
  lockedCategory?: string,
): Chip[] {
  const chips: Chip[] = [];
  if (f.category && !lockedCategory) {
    const cat = categories.find((c) => c.slug === f.category);
    chips.push({ key: "cat", label: cat?.name ?? f.category, clear: { category: null } });
  }
  f.brands.forEach((b) =>
    chips.push({ key: `brand-${b}`, label: b, clear: { brands: f.brands.filter((x) => x !== b) } }),
  );
  if (f.priceMin > bounds.min || f.priceMax < bounds.max) {
    chips.push({
      key: "price",
      label: `${formatPrice(f.priceMin)} – ${formatPrice(f.priceMax)}`,
      clear: { priceMin: bounds.min, priceMax: bounds.max },
    });
  }
  f.sizes.forEach((s) =>
    chips.push({ key: `size-${s}`, label: `Size ${s}`, clear: { sizes: f.sizes.filter((x) => x !== s) } }),
  );
  f.colors.forEach((c) =>
    chips.push({ key: `color-${c}`, label: c, clear: { colors: f.colors.filter((x) => x !== c) } }),
  );
  f.materials.forEach((m) =>
    chips.push({ key: `mat-${m}`, label: m, clear: { materials: f.materials.filter((x) => x !== m) } }),
  );
  if (f.minRating > 0) {
    chips.push({ key: "rating", label: `${f.minRating}★ & up`, clear: { minRating: 0 } });
  }
  if (f.minDiscount > 0) {
    chips.push({ key: "discount", label: `${f.minDiscount}%+ off`, clear: { minDiscount: 0 } });
  }
  if (f.inStockOnly) chips.push({ key: "stock", label: "In stock", clear: { inStockOnly: false } });
  if (f.onSaleOnly) chips.push({ key: "sale", label: "On sale", clear: { onSaleOnly: false } });
  f.conditions.forEach((c) =>
    chips.push({ key: `cond-${c}`, label: c, clear: { conditions: f.conditions.filter((x) => x !== c) } }),
  );
  f.shipping.forEach((s) =>
    chips.push({ key: `ship-${s}`, label: s, clear: { shipping: f.shipping.filter((x) => x !== s) } }),
  );
  f.sellers.forEach((s) =>
    chips.push({ key: `sell-${s}`, label: s, clear: { sellers: f.sellers.filter((x) => x !== s) } }),
  );
  f.collections.forEach((c) => {
    const label = COLLECTIONS.find((x) => x.key === c)?.label ?? c;
    chips.push({
      key: `coll-${c}`,
      label,
      clear: { collections: f.collections.filter((x) => x !== c) },
    });
  });
  if (f.search) chips.push({ key: "search", label: `"${f.search}"`, clear: { search: "" } });
  return chips;
}

// ── Sub-components ──

function FilterIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function ViewToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} view`}
      aria-pressed={active}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md transition",
        active ? "bg-[var(--color-gold)] text-white shadow-sm" : "text-ink-soft hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function GridGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ListGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <rect x="2" y="3" width="16" height="3.5" rx="1.5" />
      <rect x="2" y="8.25" width="16" height="3.5" rx="1.5" />
      <rect x="2" y="13.5" width="16" height="3.5" rx="1.5" />
    </svg>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-alt">
        <SearchIcon className="h-7 w-7 text-ink-soft" />
      </div>
      <h3 className="mt-5 font-serif text-xl text-ink">No products match your filters</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        Try widening your price range, lowering the rating, or clearing a filter to see more of the
        collection.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full bg-[var(--color-gold)] px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(200,162,75,0.35)] transition hover:bg-[var(--color-gold-dark)]"
      >
        Clear all filters
      </button>
    </div>
  );
}

function CardSkeleton({ list = false }: { list?: boolean }) {
  if (list) {
    return (
      <div className="flex gap-5 rounded-2xl border border-line p-4">
        <div className="skeleton aspect-square w-44 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton mt-auto h-4 w-24 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-square w-full rounded-[var(--radius-card)]" />
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  );
}
