/**
 * Promote a curated set of realistic products as the homepage "featured" items.
 *
 * The homepage reads featured products from Postgres (getFeaturedProducts), so
 * updating mock-data alone is not enough when DATABASE_URL is set. This script:
 *   1. Clears the `featured` flag on all existing products.
 *   2. Upserts the curated products (by slug) into their category with real
 *      names, descriptions, images, and prices, marked featured.
 * Idempotent — safe to run repeatedly. Run: npx tsx scripts/feature-real-products.ts
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { CURATED_FEATURED } from "../lib/mock-data";

const prisma = new PrismaClient();

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function realImg(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

async function main() {
  console.log("Promoting curated featured products…");

  const categories = await prisma.category.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  // 1. Clear all existing featured flags.
  const cleared = await prisma.product.updateMany({
    where: { featured: true },
    data: { featured: false },
  });
  console.log(`  Cleared featured flag on ${cleared.count} products.`);

  // 2. Upsert curated products as featured.
  let n = 0;
  for (let i = 0; i < CURATED_FEATURED.length; i++) {
    const p = CURATED_FEATURED[i];
    const category = catBySlug.get(p.categorySlug);
    if (!category) {
      console.warn(`  ! Skipping "${p.name}" — category ${p.categorySlug} not found.`);
      continue;
    }
    const slug = `${slugify(p.name)}-featured-${i}`;
    const data = {
      name: p.name,
      description: p.description,
      price: new Prisma.Decimal(p.price),
      compareAt: p.compareAt == null ? null : new Prisma.Decimal(p.compareAt),
      images: p.imageIds.map(realImg),
      stock: 12 + i,
      featured: true,
      rating: Math.round((4.3 + (i % 6) / 10) * 10) / 10,
      numReviews: 24 + i * 7,
      categoryId: category.id,
    };
    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    n++;
    console.log(`  ✓ ${p.name} (${category.name})`);
  }

  console.log(`Done. ${n} curated products are now featured on the homepage.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
