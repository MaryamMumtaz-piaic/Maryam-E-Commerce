import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, SparkleIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

export const metadata = { title: "About" };

const VALUES = [
  { icon: SparkleIcon, title: "Considered design", text: "Every piece is designed with restraint and built to feel right in daily life." },
  { icon: ShieldIcon, title: "Quality first", text: "Premium materials and careful construction — fewer, better things." },
  { icon: TruckIcon, title: "Honest service", text: "Free shipping over $75, easy returns, and a team that genuinely cares." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-80 w-full overflow-hidden bg-ink">
        <Image src="https://picsum.photos/seed/maryam-about/1920/1080" alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">Our story</p>
            <h1 className="max-w-2xl font-serif text-4xl text-white sm:text-5xl">
              Fewer, better things — made to last.
            </h1>
          </div>
        </div>
      </section>

      <Section className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl tracking-tight">How Maryam began</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Maryam started with a simple frustration: too much stuff, too little meaning.
              We set out to build a store for people who&apos;d rather own a few things they
              love than many they tolerate. Every product in our catalog is chosen for its
              craftsmanship, its materials, and its ability to stay relevant for years — not
              seasons.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              From refined apparel to considered home goods, we partner with makers who share
              our belief that good design is quiet, durable, and honest. That philosophy shapes
              everything — from the products we stock to the way we treat our customers.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface-alt">
            <Image src="https://picsum.photos/seed/maryam-story/800/600" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <SectionHeading eyebrow="What we value" title="The principles behind every piece" align="center" />
        <div className="grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-[var(--radius-card)] border border-line p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-lg">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="rounded-[var(--radius-card)] bg-ink px-8 py-14 text-center sm:px-16">
          <h2 className="mx-auto max-w-xl font-serif text-3xl text-white">Ready to find your next favorite thing?</h2>
          <div className="mt-8">
            <ButtonLink href="/products" variant="gold" size="lg">
              Shop the collection <ArrowRight className="h-4.5 w-4.5" />
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
