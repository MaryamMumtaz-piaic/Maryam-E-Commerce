import { getCategories, getFeaturedProducts } from "@/lib/data";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SearchBar } from "@/components/layout/SearchBar";
import { ArrowRight, ShieldIcon, TruckIcon, SparkleIcon } from "@/components/ui/icons";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "New Season",
    title: "Considered goods, made to last.",
    subtitle:
      "Discover a curated edit of refined apparel, footwear, and home pieces — designed with restraint and built from premium materials.",
    cta: { label: "Shop the collection", href: "/products" },
    image: "https://picsum.photos/seed/maryam-hero-1/1920/1080",
  },
  {
    eyebrow: "Timeless Essentials",
    title: "The quiet luxury of everyday.",
    subtitle:
      "Pieces that work harder and last longer. Thoughtful design you reach for again and again.",
    cta: { label: "Explore essentials", href: "/categories/apparel" },
    image: "https://picsum.photos/seed/maryam-hero-2/1920/1080",
  },
  {
    eyebrow: "Home & Living",
    title: "A calmer home starts here.",
    subtitle:
      "Considered objects in natural materials — crafted to bring warmth and ease to your space.",
    cta: { label: "Shop home", href: "/categories/home-living" },
    image: "https://picsum.photos/seed/maryam-hero-3/1920/1080",
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
