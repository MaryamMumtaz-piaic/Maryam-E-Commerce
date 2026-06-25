import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";

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
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const { products, total } = await getProducts({ category: slug, pageSize: 24 });

  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Category"
        title={category.name}
        description={category.description ?? `${total} products available.`}
      />
      <ProductGrid products={products} />
    </Section>
  );
}
