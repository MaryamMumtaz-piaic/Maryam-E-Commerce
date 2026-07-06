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

// Real Unsplash image (all URLs verified reachable). Sized for product cards.
function realImg(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

// Curated, production-realistic featured products shown on the homepage. Shared
// shape used both for mock mode and to update the live catalog's featured items.
export const CURATED_FEATURED: {
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  categorySlug: string;
  imageIds: string[];
}[] = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation, 40-hour battery life, and plush memory-foam ear cushions for all-day comfort. Bluetooth 5.3 with instant multi-device pairing.",
    price: 149.99,
    compareAt: 219.99,
    categorySlug: "electronics",
    imageIds: ["1505740420928-5e560c06d30e", "1546435770-a3e426bf472b", "1484704849700-f032a568e944"],
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track heart rate, sleep, SpO2, and 100+ workout modes with a bright AMOLED display. Water-resistant to 50m with up to 14 days of battery on a single charge.",
    price: 129.0,
    compareAt: 179.0,
    categorySlug: "electronics",
    imageIds: ["1546868871-7041f2a55e12", "1523275335684-37898b6baf30", "1579586337278-3befd40fd17a"],
  },
  {
    name: "Modern Wooden Dining Table",
    description:
      "Solid oak dining table seating six, hand-finished with a natural matte oil that highlights the grain. Sturdy tapered legs and a timeless silhouette built to last for decades.",
    price: 699.0,
    compareAt: 949.0,
    categorySlug: "home-living",
    imageIds: ["1533090481720-856c6e3c1fdc", "1617104678098-de229db51175", "1615874959474-d609969a20ed"],
  },
  {
    name: "Ergonomic Office Chair",
    description:
      "Breathable mesh office chair with adjustable lumbar support, 4D armrests, and a synchronized tilt mechanism. Engineered to keep you comfortable through long working days.",
    price: 259.0,
    compareAt: 349.0,
    categorySlug: "home-living",
    imageIds: ["1580480055273-228ff5388ef8", "1592078615290-033ee584e267", "1519947486511-46149fa0a254"],
  },
  {
    name: "Premium Leather Backpack",
    description:
      "Full-grain leather backpack with a padded 15-inch laptop sleeve, antique brass hardware, and a spacious main compartment. Ages beautifully and carries a lifetime of everyday journeys.",
    price: 189.0,
    compareAt: 249.0,
    categorySlug: "accessories",
    imageIds: ["1553062407-98eeb64c6a62", "1548036328-c9fa89d128fa", "1491637639811-60e2756cc1c7"],
  },
  {
    name: "Luxury Bedside Lamp",
    description:
      "Sculptural table lamp with a warm linen shade and a solid brass base. Casts a soft, ambient glow that brings a calm, considered mood to any bedside or reading nook.",
    price: 89.99,
    compareAt: 119.99,
    categorySlug: "home-living",
    imageIds: ["1507473885765-e6ed057f782c", "1543198126-a4d9b8a5be3c", "1524484485831-a92ffc0de03f"],
  },
  {
    name: "Minimalist White Sneakers",
    description:
      "Clean, low-profile sneakers in premium full-grain leather with a cushioned insole and durable rubber outsole. An everyday staple that pairs with everything.",
    price: 119.0,
    compareAt: null,
    categorySlug: "footwear",
    imageIds: ["1549298916-b41d501d3772", "1560769629-975ec94e6a86", "1595950653106-6c9ebd614d3a"],
  },
  {
    name: "Vitamin C Brightening Serum",
    description:
      "A lightweight daily serum with 15% vitamin C, hyaluronic acid, and vitamin E to brighten, hydrate, and even skin tone. Dermatologist-tested and suitable for all skin types.",
    price: 34.99,
    compareAt: 49.99,
    categorySlug: "beauty",
    imageIds: ["1620916566398-39f1143ab7be", "1556228720-195a672e8a03", "1571781926291-c477ebfd024b"],
  },
];

export const mockCategories: CategoryView[] = CATEGORY_DEFS.map((c, i) => ({
  id: `cat-${i}`,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: `https://picsum.photos/seed/maryam-cat-${i}/600/400`,
  productCount: 24,
}));

function buildCuratedProducts(): ProductView[] {
  const catIndex = new Map(CATEGORY_DEFS.map((c, i) => [c.slug, i]));
  return CURATED_FEATURED.map((p, idx) => {
    const ci = catIndex.get(p.categorySlug) ?? 0;
    const cat = CATEGORY_DEFS[ci];
    return {
      id: `feat-${idx}`,
      name: p.name,
      slug: `${slugify(p.name)}-${idx}`,
      description: p.description,
      price: p.price,
      compareAt: p.compareAt,
      images: p.imageIds.map(realImg),
      stock: 12 + idx,
      featured: true,
      rating: Math.round((4.3 + (idx % 6) / 10) * 10) / 10,
      numReviews: 24 + idx * 7,
      categoryId: `cat-${ci}`,
      categoryName: cat.name,
      categorySlug: cat.slug,
    };
  });
}

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
        featured: false,
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

// Curated featured items first, so the homepage's featured section shows them.
export const mockProducts: ProductView[] = [...buildCuratedProducts(), ...buildProducts()];

export const mockReviews: ReviewView[] = [
  { id: "r1", rating: 5, title: "Exceeded expectations", body: "Beautifully made and exactly as pictured. The quality is obvious the moment you unbox it.", authorName: "Sara A.", createdAt: "2026-05-12T10:00:00.000Z" },
  { id: "r2", rating: 4, title: "Great, minor sizing note", body: "Love it overall. Runs slightly large but the material and finish are excellent.", authorName: "James T.", createdAt: "2026-05-20T10:00:00.000Z" },
  { id: "r3", rating: 5, title: "Will buy again", body: "Second purchase from Maryam and the consistency is impressive. Fast shipping too.", authorName: "Lena K.", createdAt: "2026-06-01T10:00:00.000Z" },
];
