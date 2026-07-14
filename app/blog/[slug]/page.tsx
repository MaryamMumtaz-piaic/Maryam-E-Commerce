import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { Section } from "@/components/ui/Section";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const title = post?.title ?? "Blog";
  const desc = post?.excerpt ?? "Thoughts on design, quality, and living well — from the Maryam team.";
  const image = post?.image ?? "https://picsum.photos/seed/maryam-og/1200/630";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "article",
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <Section className="py-12 max-w-3xl">
      {/* Back button */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-[var(--color-gold-dark)]"
      >
        ← Back to Journal
      </Link>

      <article>
        {/* Category & Date */}
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
          <span>{post.category}</span>
          <span aria-hidden="true" className="text-ink-soft">·</span>
          <span className="text-ink-soft">{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Author information */}
        <p className="mt-4 text-sm text-ink-soft">
          Written by <span className="font-semibold text-ink">{post.author}</span>
        </p>

        {/* Hero Image */}
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] bg-surface-alt">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-stone mt-10 max-w-none text-[15px] leading-relaxed text-ink-soft space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("##")) {
              return (
                <h2 key={index} className="font-serif text-xl font-bold text-ink mt-8 pt-4 border-t border-line">
                  {paragraph.replace("##", "").trim()}
                </h2>
              );
            }
            if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
              return (
                <p key={index} className="italic text-center text-ink font-serif py-4 px-6 border-l-4 border-[var(--color-gold)] bg-surface-alt my-6">
                  {paragraph.replace(/\*/g, "").trim()}
                </p>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </article>
    </Section>
  );
}
