import { isDbConfigured, prisma } from "./prisma";
import { mockCategories, mockProducts, mockReviews } from "./mock-data";
import type { CategoryView, ProductView, ReviewView } from "./types";

// Single source of truth for reading catalog data. Uses Postgres via Prisma when
// DATABASE_URL is set; otherwise serves deterministic mock data so the app runs.

function toNum(v: unknown): number {
  if (v == null) return 0;
  // Prisma Decimal -> number
  return typeof v === "number" ? v : Number(v.toString());
}

function mapProduct(p: {
  id: string; name: string; slug: string; description: string;
  price: unknown; compareAt: unknown; images: string[]; stock: number;
  featured: boolean; rating: number; numReviews: number; categoryId: string;
  category: { name: string; slug: string };
}): ProductView {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: toNum(p.price),
    compareAt: p.compareAt == null ? null : toNum(p.compareAt),
    images: p.images,
    stock: p.stock,
    featured: p.featured,
    rating: p.rating,
    numReviews: p.numReviews,
    categoryId: p.categoryId,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
  };
}

export async function getCategories(): Promise<CategoryView[]> {
  if (!isDbConfigured) return mockCategories;
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    productCount: c._count.products,
  }));
}

export async function getFeaturedProducts(limit = 8): Promise<ProductView[]> {
  if (!isDbConfigured) return mockProducts.filter((p) => p.featured).slice(0, limit);
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getTopProducts(limit = 8): Promise<ProductView[]> {
  if (!isDbConfigured) {
    return [...mockProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  const products = await prisma.product.findMany({
    include: { category: true },
    take: limit,
    orderBy: { rating: "desc" },
  });
  return products.map(mapProduct);
}

export async function getTopSellingProducts(limit = 8): Promise<ProductView[]> {
  if (!isDbConfigured) {
    return [...mockProducts]
      .sort((a, b) => b.numReviews - a.numReviews)
      .slice(0, limit);
  }
  const products = await prisma.product.findMany({
    include: { category: true },
    take: limit,
    orderBy: { numReviews: "desc" },
  });
  return products.map(mapProduct);
}

export async function getProducts(opts: {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  page?: number;
  pageSize?: number;
} = {}): Promise<{ products: ProductView[]; total: number }> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 12;

  if (!isDbConfigured) {
    let list = [...mockProducts];
    if (opts.category) list = list.filter((p) => p.categorySlug === opts.category);
    if (opts.search) {
      const q = opts.search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    switch (opts.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    const total = list.length;
    const start = (page - 1) * pageSize;
    return { products: list.slice(start, start + pageSize), total };
  }

  const where: Record<string, unknown> = {};
  if (opts.category) where.category = { slug: opts.category };
  if (opts.search) {
    where.OR = [
      { name: { contains: opts.search, mode: "insensitive" } },
      { description: { contains: opts.search, mode: "insensitive" } },
    ];
  }
  const orderBy =
    opts.sort === "price-asc" ? { price: "asc" as const }
    : opts.sort === "price-desc" ? { price: "desc" as const }
    : opts.sort === "rating" ? { rating: "desc" as const }
    : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);
  return { products: products.map(mapProduct), total };
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  if (!isDbConfigured) return mockProducts.find((p) => p.slug === slug) ?? null;
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return p ? mapProduct(p) : null;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<ProductView[]> {
  if (!isDbConfigured) {
    return mockProducts
      .filter((p) => p.categorySlug === categorySlug && p.slug !== excludeSlug)
      .slice(0, limit);
  }
  const products = await prisma.product.findMany({
    where: { category: { slug: categorySlug }, NOT: { slug: excludeSlug } },
    include: { category: true },
    take: limit,
  });
  return products.map(mapProduct);
}

export async function getReviews(productId: string): Promise<ReviewView[]> {
  if (!isDbConfigured) return mockReviews;
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: r.user.name ?? "Anonymous",
    createdAt: r.createdAt.toISOString(),
  }));
}
