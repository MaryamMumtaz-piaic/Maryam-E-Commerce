import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { count = 50 } = await req.json();
  const n = Math.min(500, Math.max(1, Number(count)));

  if (!isDbConfigured) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message: `Demo mode: simulated import of ${n} products. Connect a database and run "npm run seed" to persist a full 1000+ catalog.`,
    });
  }

  // Lazy import faker so it isn't bundled into the client.
  const { faker } = await import("@faker-js/faker");
  const { Prisma } = await import("@prisma/client");

  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    return NextResponse.json(
      { error: "No categories found. Run the seed script first." },
      { status: 400 },
    );
  }

  const data = Array.from({ length: n }).map(() => {
    const cat = faker.helpers.arrayElement(categories);
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`;
    const price = Number(faker.commerce.price({ min: 15, max: 600 }));
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${faker.string.alphanumeric(6)}`;
    const seed = faker.string.alphanumeric(10);
    return {
      name,
      slug,
      description: faker.commerce.productDescription(),
      price: new Prisma.Decimal(price),
      images: [`https://picsum.photos/seed/${seed}/800/800`],
      stock: faker.number.int({ min: 0, max: 60 }),
      rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      numReviews: faker.number.int({ min: 0, max: 50 }),
      categoryId: cat.id,
    };
  });

  const res = await prisma.product.createMany({ data, skipDuplicates: true });

  return NextResponse.json({
    ok: true,
    message: `Imported ${res.count} products into the catalog.`,
  });
}
