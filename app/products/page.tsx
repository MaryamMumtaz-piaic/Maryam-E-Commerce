import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { ShopView } from "@/components/product/ShopView";
import { Section } from "@/components/ui/Section";
import { ShopHero, ShopSkeleton } from "@/components/product/ShopChrome";

export const metadata = { title: "Shop" };

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
