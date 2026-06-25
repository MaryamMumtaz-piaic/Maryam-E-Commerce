/**
 * Maryam.shop catalog "automation agent" — bulk import / seed script.
 *
 * Generates 1000+ products across categories using faker, plus an admin user
 * and sample reviews. Idempotent: upserts by slug/email so it can be re-run as a
 * bulk import. Run with: npm run seed  (requires DATABASE_URL).
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

faker.seed(2026); // deterministic catalog

const CATEGORIES = [
  { name: "Apparel", slug: "apparel", description: "Refined everyday clothing in timeless silhouettes." },
  { name: "Footwear", slug: "footwear", description: "Crafted shoes built for comfort and longevity." },
  { name: "Accessories", slug: "accessories", description: "Finishing touches — bags, belts, and more." },
  { name: "Home & Living", slug: "home-living", description: "Considered objects for a calmer home." },
  { name: "Beauty", slug: "beauty", description: "Clean, effective skincare and grooming." },
  { name: "Electronics", slug: "electronics", description: "Quietly powerful tech for daily life." },
  { name: "Bags & Luggage", slug: "bags-luggage", description: "Travel-ready bags built to last." },
  { name: "Jewelry", slug: "jewelry", description: "Understated pieces in precious materials." },
];

const PRODUCTS_PER_CATEGORY = 130; // 8 * 130 = 1040 products

const ADJECTIVES = ["Classic", "Heritage", "Minimal", "Tailored", "Artisan", "Luxe", "Everyday", "Signature", "Refined", "Essential", "Modern", "Vintage"];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function img(seed: string): string {
  return `https://picsum.photos/seed/${seed}/800/800`;
}

async function main() {
  console.log("Seeding Maryam catalog…");

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAILS ?? "m.samiwaseem1234@gmail.com").split(",")[0].trim();
  const adminPassword = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: { email: adminEmail, name: "Maryam Admin", password: adminPassword, role: "ADMIN" },
  });
  console.log(`Admin ready: ${adminEmail} (password: admin1234)`);

  // Demo customer
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "customer@maryam.shop" },
    update: {},
    create: { email: "customer@maryam.shop", name: "Demo Customer", password: demoPassword, role: "USER" },
  });

  let totalProducts = 0;

  for (let ci = 0; ci < CATEGORIES.length; ci++) {
    const c = CATEGORIES[ci];
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: `https://picsum.photos/seed/maryam-cat-${ci}/600/400`,
      },
    });

    const productsData: Prisma.ProductCreateManyInput[] = [];
    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
      const adj = faker.helpers.arrayElement(ADJECTIVES);
      const noun = faker.commerce.productName();
      const name = `${adj} ${noun}`;
      const slug = `${slugify(name)}-${c.slug}-${i}`;
      const price = Number(faker.commerce.price({ min: 15, max: 600 }));
      const hasSale = faker.datatype.boolean(0.25);
      const seed = `maryam-${c.slug}-${i}`;
      productsData.push({
        name,
        slug,
        description: faker.commerce.productDescription() + " " + faker.lorem.sentences(2),
        price: new Prisma.Decimal(price),
        compareAt: hasSale ? new Prisma.Decimal(Math.round(price * 1.35)) : null,
        images: [img(seed), img(`${seed}-2`), img(`${seed}-3`)],
        stock: faker.number.int({ min: 0, max: 60 }),
        featured: i < 4,
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        numReviews: faker.number.int({ min: 0, max: 80 }),
        categoryId: category.id,
      });
    }

    // Idempotent: clear this category's products then bulk insert
    await prisma.product.deleteMany({ where: { categoryId: category.id } });
    await prisma.product.createMany({ data: productsData });
    totalProducts += productsData.length;
    console.log(`  ${c.name}: ${productsData.length} products`);
  }

  // Sample reviews on a few featured products
  const sampleProducts = await prisma.product.findMany({ where: { featured: true }, take: 20 });
  for (const p of sampleProducts) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: p.id, userId: demoUser.id } },
      update: {},
      create: {
        productId: p.id,
        userId: demoUser.id,
        rating: faker.number.int({ min: 4, max: 5 }),
        title: faker.helpers.arrayElement(["Excellent quality", "Highly recommend", "Beautiful piece", "Worth every penny"]),
        body: faker.lorem.sentences(2),
      },
    });
  }

  console.log(`Done. ${totalProducts} products across ${CATEGORIES.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
