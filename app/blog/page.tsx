import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { POSTS } from "@/lib/blog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read stories, guides, and inspiration on design, quality, and mindful living from the Maryam team.",
  openGraph: {
    title: "Blog",
    description: "Read stories, guides, and inspiration on design, quality, and mindful living from the Maryam team.",
  },
  twitter: {
    title: "Blog",
    description: "Read stories, guides, and inspiration on design, quality, and mindful living from the Maryam team.",
  },
};

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
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <article className="flex flex-1 flex-col h-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-alt">
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
          </Link>
        ))}
      </div>
    </Section>
  );
}

