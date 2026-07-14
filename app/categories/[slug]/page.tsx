import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/data";
import { ShopView } from "@/components/product/ShopView";
import { Section } from "@/components/ui/Section";
import { ShopHero, ShopSkeleton } from "@/components/product/ShopChrome";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  const title = cat?.name ?? "Category";
  const desc = cat?.description
    ? cat.description.substring(0, 160)
    : `Explore our premium collection of ${title.toLowerCase()} at Maryam. Refined designs and high-quality materials.`;
  const image = cat?.image ?? "https://picsum.photos/seed/maryam-og/1200/630";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [image],
    },
  };
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
    <Section className="py-4 sm:py-5">
      <ShopHero eyebrow="Collection" title={category.name} />

      <Suspense fallback={<ShopSkeleton />}>
        <ShopView products={products} categories={categories} lockedCategory={slug} />
      </Suspense>
    </Section>
  );
}
