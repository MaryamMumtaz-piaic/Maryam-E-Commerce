import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { ShopView } from "@/components/product/ShopView";
import { Section } from "@/components/ui/Section";
import { ShopHero, ShopSkeleton } from "@/components/product/ShopChrome";

import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const isSearch = typeof resolvedSearchParams.search === "string" && resolvedSearchParams.search.trim().length > 0;
  const pageTitle = isSearch ? "Search" : "Shop";
  const desc = isSearch
    ? `Search results for "${resolvedSearchParams.search}" at Maryam. Explore our range of premium products.`
    : "Browse our premium collection of apparel, footwear, accessories, and home goods.";

  return {
    title: pageTitle,
    description: desc,
    openGraph: {
      title: pageTitle,
      description: desc,
    },
    twitter: {
      title: pageTitle,
      description: desc,
    },
  };
}

export default async function ProductsPage() {
  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 1000 }),
  ]);

  return (
    <Section className="py-4 sm:py-5">
      <ShopHero eyebrow="The Collection" title="All Products" />

      <Suspense fallback={<ShopSkeleton />}>
        <ShopView products={products} categories={categories} />
      </Suspense>
    </Section>
  );
}
