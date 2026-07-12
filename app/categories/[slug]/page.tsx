import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/data";
import { ShopView } from "@/components/product/ShopView";
import { Section } from "@/components/ui/Section";
import { ShopHero, ShopSkeleton } from "@/components/product/ShopChrome";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({ category: slug, pageSize: 1000 }),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <Section className="py-8 sm:py-10">
      <ShopHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: category.name },
        ]}
        eyebrow="Category"
        title={category.name}
        description={category.description ?? `Discover our ${category.name.toLowerCase()} selection.`}
        count={total}
      />

      <Suspense fallback={<ShopSkeleton />}>
        <ShopView products={products} categories={categories} lockedCategory={slug} />
      </Suspense>
    </Section>
  );
}
