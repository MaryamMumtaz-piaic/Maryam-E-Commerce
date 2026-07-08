import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata = { title: "Blog" };

const POSTS = [
  {
    title: "How to Build a Capsule Wardrobe That Lasts",
    excerpt: "Fewer, better pieces — the art of choosing garments that work together season after season.",
    category: "Style",
    date: "June 18, 2026",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    title: "The Quiet Luxury of Everyday Objects",
    excerpt: "Why the things we use daily deserve as much thought as the ones we save for special occasions.",
    category: "Home & Living",
    date: "June 10, 2026",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    title: "A Skincare Routine That Actually Works",
    excerpt: "Cut through the noise with a simple, effective routine built around a few honest products.",
    category: "Beauty",
    date: "June 2, 2026",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    title: "Tech That Fits Into Life, Not the Other Way Around",
    excerpt: "The best gadgets disappear into your routine. Here's how to choose devices that serve you.",
    category: "Electronics",
    date: "May 24, 2026",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    title: "Caring for Leather So It Ages Beautifully",
    excerpt: "A little maintenance goes a long way. Keep your bags and shoes looking their best for years.",
    category: "Accessories",
    date: "May 15, 2026",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    title: "The Case for Buying Less, Choosing Well",
    excerpt: "Our founder on the philosophy that shapes every product we choose to stock.",
    category: "Journal",
    date: "May 6, 2026",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
  },
];

export default function BlogPage() {
  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="The Journal"
        title="Stories, guides & inspiration"
        description="Thoughts on design, quality, and living well — from the Maryam team."
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article
            key={post.title}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
              <Image
                src={post.image}
                alt={post.title}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
                <span>{post.category}</span>
                <span aria-hidden="true" className="text-ink-soft">·</span>
                <span className="text-ink-soft">{post.date}</span>
              </div>
              <h3 className="mt-2 font-serif text-lg leading-snug text-ink transition-colors duration-200 group-hover:text-[var(--color-gold-dark)]">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
