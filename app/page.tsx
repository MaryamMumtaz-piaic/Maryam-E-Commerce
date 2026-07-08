import { getCategories, getFeaturedProducts, getTopProducts, getTopSellingProducts } from "@/lib/data";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { CategorySlider } from "@/components/home/CategorySlider";
import { TopProducts } from "@/components/home/TopProducts";
import { TopSellingGallery } from "@/components/home/TopSellingGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SearchBar } from "@/components/layout/SearchBar";
import { ArrowRight } from "@/components/ui/icons";

// Fixed hero image standard: every slide delivered at identical 16:9 dimensions,
// auto-cropped to the most relevant region so any source image fits without distortion.
const HERO_IMG = "?auto=format&fit=crop&crop=entropy&w=1600&h=900&q=80";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Electronics · Up to 40% Off",
    title: "Sound without limits.",
    subtitle:
      "Premium wireless headphones engineered for pure, immersive sound. Save up to 40% during Tech Week.",
    cta: { label: "Buy Now", href: "/categories/electronics" },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" + HERO_IMG,
  },
  {
    eyebrow: "Fashion · New Autumn Arrivals",
    title: "Dress with intention.",
    subtitle:
      "Timeless apparel in premium fabrics — tailored coats and everyday essentials. 25% off with code STYLE25.",
    cta: { label: "Buy Now", href: "/categories/apparel" },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8" + HERO_IMG,
  },
  {
    eyebrow: "Furniture · Clearance Event",
    title: "Furniture built to last.",
    subtitle:
      "Solid-wood tables and statement chairs at their lowest prices of the season. Save up to 50%.",
    cta: { label: "Buy Now", href: "/categories/home-living" },
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c" + HERO_IMG,
  },
  {
    eyebrow: "Beauty · Glow Edit",
    title: "Skincare that works.",
    subtitle:
      "Clean, effective serums and treatments loved by thousands. Free travel-size gift on orders over $50.",
    cta: { label: "Buy Now", href: "/categories/beauty" },
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" + HERO_IMG,
  },
  {
    eyebrow: "Accessories · Finishing Touches",
    title: "Details make the look.",
    subtitle:
      "Leather bags and watches crafted to last a lifetime. Save 30% on selected accessories this week.",
    cta: { label: "Buy Now", href: "/categories/accessories" },
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3" + HERO_IMG,
  },
];



export default async function HomePage() {
  const [categories, featured, topProducts, topSelling] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getTopProducts(8),
    getTopSellingProducts(16),
  ]);

  return (
    <>
      {/* 1. Hero Section */}
      <HeroCarousel slides={SLIDES} />

      {/* Mobile search (desktop has it in navbar) */}
      <Section className="py-6 md:hidden">
        <SearchBar />
      </Section>

      {/* 2. Categories */}
      <section className="w-full py-12 overflow-hidden">
        {/* Premium section header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Shop by Category
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Discover Our Collections
              </h2>
              <div className="mt-3 h-px w-12 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                Explore premium products across carefully curated categories designed for every lifestyle.
              </p>
            </div>
            <ButtonLink href="/products" variant="outline" size="sm" className="self-start sm:self-auto flex-shrink-0">
              View all <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
        {/* Infinite auto-scrolling slider */}
        <CategorySlider categories={categories} />
      </section>

      {/* 3. Top Products — new section */}
      <TopProducts products={topProducts} />

      {/* 4. Featured products — moved below Top Products */}
      <Section className="py-10">
        <SectionHeading
          eyebrow="Editor's picks"
          title="Featured products"
          description="A handpicked selection of our most-loved pieces."
          action={
            <ButtonLink href="/products" variant="outline" size="sm">
              Shop all <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <ProductGrid products={featured} />
      </Section>

      {/* 5. Top Selling Products Gallery — new section */}
      <TopSellingGallery products={topSelling} />

      {/* 6. Customer Testimonials */}
      <Testimonials />
    </>
  );
}
