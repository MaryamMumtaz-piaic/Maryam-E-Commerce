import type { CategoryView, ProductView, ReviewView } from "./types";

// Deterministic mock catalog used when DATABASE_URL is not configured, so the
// UI is fully demoable without a database. The real catalog (1000+ items) lives
// in Postgres via scripts/seed.ts.

const CATEGORY_DEFS: { name: string; slug: string; description: string }[] = [
  { name: "Apparel", slug: "apparel", description: "Refined everyday clothing in timeless silhouettes." },
  { name: "Footwear", slug: "footwear", description: "Crafted shoes built for comfort and longevity." },
  { name: "Accessories", slug: "accessories", description: "Finishing touches — bags, belts, and more." },
  { name: "Home & Living", slug: "home-living", description: "Considered objects for a calmer home." },
  { name: "Beauty", slug: "beauty", description: "Clean, effective skincare and grooming." },
  { name: "Electronics", slug: "electronics", description: "Quietly powerful tech for daily life." },
];

const ADJECTIVES = ["Classic", "Heritage", "Minimal", "Tailored", "Artisan", "Luxe", "Everyday", "Signature", "Refined", "Essential"];
const NOUNS: Record<string, string[]> = {
  apparel: ["Oxford Shirt", "Wool Coat", "Linen Trousers", "Cashmere Sweater", "Cotton Tee", "Pleated Skirt"],
  footwear: ["Leather Loafers", "Suede Boots", "Canvas Sneakers", "Derby Shoes", "Ankle Boots", "Slip-Ons"],
  accessories: ["Leather Tote", "Silk Scarf", "Card Holder", "Woven Belt", "Felt Hat", "Crossbody Bag"],
  "home-living": ["Ceramic Vase", "Linen Throw", "Oak Tray", "Scented Candle", "Stoneware Mug", "Wool Rug"],
  beauty: ["Face Serum", "Hand Cream", "Cleansing Balm", "Lip Treatment", "Day Moisturizer", "Body Oil"],
  electronics: ["Wireless Earbuds", "Desk Lamp", "Bluetooth Speaker", "Smart Watch", "Charging Pad", "Mini Camera"],
};

function priceFor(seed: number): number {
  return Math.round((19 + (seed * 37) % 480) ) + 0.99;
}

function imageFor(seed: number): string {
  return `https://picsum.photos/seed/maryam-${seed}/800/800`;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const mockCategories: CategoryView[] = CATEGORY_DEFS.map((c, i) => ({
  id: `cat-${i}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: `https://picsum.photos/seed/maryam-cat-${i}/600/400`,
  productCount: 24,
}));

function buildProducts(): ProductView[] {
  const out: ProductView[] = [];
  let seed = 1;
  CATEGORY_DEFS.forEach((cat, ci) => {
    const nouns = NOUNS[cat.slug];
    for (let i = 0; i < 24; i++) {
      const adj = ADJECTIVES[i % ADJECTIVES.length];
      const noun = nouns[i % nouns.length];
      const name = `${adj} ${noun}`;
      const slug = `${slugify(name)}-${cat.slug}-${i}`;
      const price = priceFor(seed);
      const hasSale = seed % 4 === 0;
      out.push({
        id: `prod-${seed}`,
        name,
        slug,
        description: `${name} from the Maryam ${cat.name} collection. Made from premium materials with meticulous attention to detail, designed to last and to feel considered in everyday use.`,
        price,
        compareAt: hasSale ? Math.round(price * 1.35) + 0.99 : null,
        images: [imageFor(seed), imageFor(seed + 1000), imageFor(seed + 2000)],
        stock: 5 + (seed % 40),
        featured: i < 4,
        rating: Math.round((3.6 + (seed % 14) / 10) * 10) / 10,
        numReviews: 3 + (seed % 60),
        categoryId: `cat-${ci}`,
        categoryName: cat.name,
        categorySlug: cat.slug,
      });
      seed++;
    }
  });
  return out;
}

export const mockProducts: ProductView[] = buildProducts();

export const mockReviews: ReviewView[] = [
  { id: "r1", rating: 5, title: "Exceeded expectations", body: "Beautifully made and exactly as pictured. The quality is obvious the moment you unbox it.", authorName: "Sara A.", createdAt: "2026-05-12T10:00:00.000Z" },
  { id: "r2", rating: 4, title: "Great, minor sizing note", body: "Love it overall. Runs slightly large but the material and finish are excellent.", authorName: "James T.", createdAt: "2026-05-20T10:00:00.000Z" },
  { id: "r3", rating: 5, title: "Will buy again", body: "Second purchase from Maryam and the consistency is impressive. Fast shipping too.", authorName: "Lena K.", createdAt: "2026-06-01T10:00:00.000Z" },
];
