import { getCategories } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/Section";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse our curated categories of refined apparel, footwear, electronics, accessories, and home goods.",
  openGraph: {
    title: "Categories",
    description: "Browse our curated categories of refined apparel, footwear, electronics, accessories, and home goods.",
  },
  twitter: {
    title: "Categories",
    description: "Browse our curated categories of refined apparel, footwear, electronics, accessories, and home goods.",
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  const CURATED_IMAGES: Record<string, string> = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=480&h=600",
    beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=480&h=600",
    apparel: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=480&h=600",
    accessories: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=480&h=600",
    "home-living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=480&h=600",
  };

  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Collections"
        title="Shop by Category"
        description="Explore our handpicked selections across curated departments."
        align="center"
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
        {categories.map((cat) => {
          const img = cat.image || CURATED_IMAGES[cat.slug] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=480&h=600";
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface-alt transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src={img}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="font-serif text-xl font-bold tracking-tight">{cat.name}</h3>
                <p className="mt-1 text-xs text-white/80 uppercase tracking-wider">{cat.productCount} Products</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
