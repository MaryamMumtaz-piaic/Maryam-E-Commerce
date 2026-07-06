import { getCategories, getFeaturedProducts } from "@/lib/data";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SearchBar } from "@/components/layout/SearchBar";
import { ArrowRight, ShieldIcon, TruckIcon, SparkleIcon } from "@/components/ui/icons";

const HERO_IMG = "?auto=format&fit=crop&w=1920&q=80";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Electronics · Up to 40% Off",
    title: "Sound without limits.",
    subtitle:
      "Premium wireless headphones, earbuds, and smart devices. Save up to 40% during our Tech Week event — free shipping on every order.",
    cta: { label: "Shop Now", href: "/categories/electronics" },
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661" + HERO_IMG,
  },
  {
    eyebrow: "Fashion · New Autumn Arrivals",
    title: "Dress with intention.",
    subtitle:
      "Timeless apparel in premium fabrics — tailored coats, knitwear, and everyday essentials. Enjoy 25% off your first order with code STYLE25.",
    cta: { label: "Explore Collection", href: "/categories/apparel" },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8" + HERO_IMG,
  },
  {
    eyebrow: "Furniture · Clearance Event",
    title: "Furniture built to last.",
    subtitle:
      "Solid-wood dining tables, ergonomic chairs, and statement pieces at their lowest prices of the season. Save up to 50% while stocks last.",
    cta: { label: "View Deals", href: "/categories/home-living" },
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" + HERO_IMG,
  },
  {
    eyebrow: "Home & Living · Cozy Season",
    title: "A calmer home starts here.",
    subtitle:
      "Considered objects in natural materials — throws, ceramics, and warm lighting to bring ease to your space. Buy 2, get 1 free on home décor.",
    cta: { label: "Shop Now", href: "/categories/home-living" },
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace" + HERO_IMG,
  },
  {
    eyebrow: "Beauty · Glow Edit",
    title: "Skincare that works.",
    subtitle:
      "Clean, effective serums, creams, and treatments loved by thousands. Get a free travel-size gift on all beauty orders over $50.",
    cta: { label: "Explore Collection", href: "/categories/beauty" },
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" + HERO_IMG,
  },
  {
    eyebrow: "Accessories · Finishing Touches",
    title: "Details make the look.",
    subtitle:
      "Leather bags, watches, and everyday carry crafted to last a lifetime. Save 30% on selected accessories this week only.",
    cta: { label: "View Deals", href: "/categories/accessories" },
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3" + HERO_IMG,
  },
];

const PERKS = [
  { icon: TruckIcon, title: "Free shipping", text: "On all orders over $75, worldwide." },
  { icon: ShieldIcon, title: "Secure checkout", text: "Encrypted payments via Stripe." },
  { icon: SparkleIcon, title: "Crafted quality", text: "Premium materials, made to last." },
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

      {/* Perks strip */}
      <Section className="py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface-alt px-5 py-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
                <p.icon className="h-5.5 w-5.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{p.title}</p>
                <p className="text-sm text-ink-soft">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
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
