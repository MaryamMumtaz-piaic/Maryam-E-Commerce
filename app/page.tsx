import { getCategories, getFeaturedProducts } from "@/lib/data";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
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
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <>
      <HeroCarousel slides={SLIDES} />

      {/* Mobile search (desktop has it in navbar) */}
      <Section className="py-6 md:hidden">
        <SearchBar />
      </Section>



      {/* Categories */}
      <Section className="py-10">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Explore our collections, each curated for quality and timeless appeal."
          action={
            <ButtonLink href="/products" variant="outline" size="sm">
              View all <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <CategoryGrid categories={categories} />
      </Section>

      {/* Featured products */}
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

      {/* Editorial CTA */}
      <Section className="py-10">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink px-8 py-16 text-center sm:px-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            Our story
          </p>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl text-white sm:text-4xl">
            Design with intention. Quality without compromise.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Maryam began with a simple idea — fewer, better things. Learn the story
            behind the studio and the values that shape every piece.
          </p>
          <div className="mt-8">
            <ButtonLink href="/about" variant="gold" size="lg">
              Read our story <ArrowRight className="h-4.5 w-4.5" />
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
