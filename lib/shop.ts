import type { ProductView } from "./types";

export type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

export type CollectionKey = "featured" | "new" | "bestselling" | "popular";

export type Filters = {
  category: string | null;
  brands: string[];
  priceMin: number;
  priceMax: number;
  sizes: string[];
  colors: string[];
  materials: string[];
  minRating: number;
  minDiscount: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  conditions: string[];
  shipping: string[];
  sellers: string[];
  collections: CollectionKey[];
  search: string;
};

export const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
];

export const RATING_OPTIONS = [4, 3, 2, 1];
export const DISCOUNT_OPTIONS = [10, 25, 40, 50];

export const CONDITIONS = ["New", "Refurbished", "Used"] as const;
export const SHIPPING_OPTIONS = ["Free shipping", "Express delivery"] as const;

export const COLLECTIONS: { key: CollectionKey; label: string }[] = [
  { key: "featured", label: "Featured products" },
  { key: "new", label: "New arrivals" },
  { key: "bestselling", label: "Best selling" },
  { key: "popular", label: "Popular choices" },
];

// ── Deterministic facet derivation ───────────────────────────────────────────
// The catalog schema has no brand/color/size/material columns, so we derive
// stable pseudo-facets from each product's immutable id + category. Same product
// always resolves to the same facets across renders and between mock/DB modes,
// so every filter genuinely narrows the grid.

const BRANDS = ["Maryam Atelier", "Nordic Muse", "Studio Lune", "Verano", "Kōa", "Aurelia", "Meridian", "Loft & Co"];
const COLOR_SWATCHES: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1c1c1c" },
  { name: "White", hex: "#f4f4f2" },
  { name: "Grey", hex: "#9a9a9a" },
  { name: "Beige", hex: "#d8c6aa" },
  { name: "Navy", hex: "#2a3a5e" },
  { name: "Brown", hex: "#7b5535" },
  { name: "Green", hex: "#4f6b52" },
  { name: "Gold", hex: "#c8a24b" },
];
const MATERIALS = ["Cotton", "Leather", "Wool", "Linen", "Ceramic", "Metal", "Wood", "Synthetic"];
const SELLERS = ["Maryam Official", "Prime Market", "Urban Depot", "Craft House"];
const SIZE_SETS: Record<string, string[]> = {
  apparel: ["XS", "S", "M", "L", "XL", "XXL"],
  footwear: ["6", "7", "8", "9", "10", "11"],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Facets = {
  brand: string;
  colors: string[];
  sizes: string[];
  material: string;
  condition: string;
  sellers: string[];
  shipping: string[];
  discountPct: number;
};

const facetCache = new WeakMap<ProductView, Facets>();

export function facetsFor(p: ProductView): Facets {
  const cached = facetCache.get(p);
  if (cached) return cached;

  const h = hash(p.id);
  const brand = BRANDS[h % BRANDS.length];

  // 1–2 colors per product.
  const c1 = COLOR_SWATCHES[h % COLOR_SWATCHES.length].name;
  const c2 = COLOR_SWATCHES[(h >>> 3) % COLOR_SWATCHES.length].name;
  const colors = c1 === c2 ? [c1] : [c1, c2];

  const sizeSet = SIZE_SETS[p.categorySlug];
  const sizes = sizeSet ? sizeSet.filter((_, i) => ((h >>> i) & 1) === 1 || i % 2 === 0) : ["One size"];

  const material = MATERIALS[(h >>> 6) % MATERIALS.length];

  // Mostly New; a minority Refurbished/Used.
  const cond = h % 10;
  const condition = cond < 7 ? "New" : cond < 9 ? "Refurbished" : "Used";

  const sellers = [SELLERS[h % SELLERS.length]];
  if ((h >>> 4) % 3 === 0) sellers.push(SELLERS[(h >>> 8) % SELLERS.length]);

  const shipping: string[] = [];
  if (p.price >= 75 || h % 2 === 0) shipping.push("Free shipping");
  if (h % 3 === 0) shipping.push("Express delivery");

  const discountPct =
    p.compareAt != null && p.compareAt > p.price
      ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
      : 0;

  const facets: Facets = {
    brand,
    colors: [...new Set(colors)],
    sizes,
    material,
    condition,
    sellers: [...new Set(sellers)],
    shipping,
    discountPct,
  };
  facetCache.set(p, facets);
  return facets;
}

export type FacetIndex = {
  brands: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  materials: string[];
  sellers: string[];
};

export function buildFacetIndex(products: ProductView[]): FacetIndex {
  const brands = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const materials = new Set<string>();
  const sellers = new Set<string>();
  for (const p of products) {
    const f = facetsFor(p);
    brands.add(f.brand);
    f.colors.forEach((c) => colors.add(c));
    f.sizes.forEach((s) => sizes.add(s));
    materials.add(f.material);
    f.sellers.forEach((s) => sellers.add(s));
  }
  const colorList = COLOR_SWATCHES.filter((c) => colors.has(c.name));
  // Preserve natural size order for the known size sets; alpha for the rest.
  const sizeOrder = [...SIZE_SETS.apparel, ...SIZE_SETS.footwear, "One size"];
  const sizeList = [...sizes].sort((a, b) => {
    const ia = sizeOrder.indexOf(a);
    const ib = sizeOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });
  return {
    brands: [...brands].sort(),
    colors: colorList,
    sizes: sizeList,
    materials: [...materials].sort(),
    sellers: [...sellers].sort(),
  };
}

export function defaultFilters(bounds: { min: number; max: number }): Filters {
  return {
    category: null,
    brands: [],
    priceMin: bounds.min,
    priceMax: bounds.max,
    sizes: [],
    colors: [],
    materials: [],
    minRating: 0,
    minDiscount: 0,
    inStockOnly: false,
    onSaleOnly: false,
    conditions: [],
    shipping: [],
    sellers: [],
    collections: [],
    search: "",
  };
}

export function priceBounds(products: ProductView[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 1000 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

function isOnSale(p: ProductView): boolean {
  return p.compareAt != null && p.compareAt > p.price;
}

// Collection membership derived from real fields. "new" = top third by id order
// isn't available here, so we approximate: featured→featured flag, bestselling &
// popular→review volume, new→recent (higher seed ids sort later, but we lack a
// date, so use a deterministic subset via rating/reviews split).
function inCollection(p: ProductView, key: CollectionKey): boolean {
  switch (key) {
    case "featured":
      return p.featured;
    case "bestselling":
      return p.numReviews >= 30;
    case "popular":
      return p.rating >= 4.3;
    case "new":
      return hash(p.id) % 4 === 0;
    default:
      return false;
  }
}

export function applyFilters(
  products: ProductView[],
  f: Filters,
  _bounds: { min: number; max: number },
): ProductView[] {
  return products.filter((p) => {
    if (f.category && p.categorySlug !== f.category) return false;
    if (p.price < f.priceMin || p.price > f.priceMax) return false;
    if (f.minRating > 0 && p.rating < f.minRating) return false;
    if (f.inStockOnly && p.stock <= 0) return false;
    if (f.onSaleOnly && !isOnSale(p)) return false;

    if (
      f.brands.length ||
      f.colors.length ||
      f.sizes.length ||
      f.materials.length ||
      f.conditions.length ||
      f.shipping.length ||
      f.sellers.length ||
      f.minDiscount > 0
    ) {
      const facets = facetsFor(p);
      if (f.brands.length && !f.brands.includes(facets.brand)) return false;
      if (f.colors.length && !f.colors.some((c) => facets.colors.includes(c))) return false;
      if (f.sizes.length && !f.sizes.some((s) => facets.sizes.includes(s))) return false;
      if (f.materials.length && !f.materials.includes(facets.material)) return false;
      if (f.conditions.length && !f.conditions.includes(facets.condition)) return false;
      if (f.shipping.length && !f.shipping.every((s) => facets.shipping.includes(s))) return false;
      if (f.sellers.length && !f.sellers.some((s) => facets.sellers.includes(s))) return false;
      if (f.minDiscount > 0 && facets.discountPct < f.minDiscount) return false;
    }

    if (f.collections.length && !f.collections.every((k) => inCollection(p, k))) return false;

    if (f.search) {
      const q = f.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function sortProducts(products: ProductView[], sort: SortKey): ProductView[] {
  const out = [...products];
  switch (sort) {
    case "price-asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      out.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return out;
}

export function countActiveFilters(f: Filters, bounds: { min: number; max: number }): number {
  let n = 0;
  if (f.category) n++;
  n += f.brands.length;
  if (f.priceMin > bounds.min || f.priceMax < bounds.max) n++;
  n += f.sizes.length;
  n += f.colors.length;
  n += f.materials.length;
  if (f.minRating > 0) n++;
  if (f.minDiscount > 0) n++;
  if (f.inStockOnly) n++;
  if (f.onSaleOnly) n++;
  n += f.conditions.length;
  n += f.shipping.length;
  n += f.sellers.length;
  n += f.collections.length;
  if (f.search) n++;
  return n;
}
