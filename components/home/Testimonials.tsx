"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  avatar: string;
  category: string;
  review: string;
};

// Realistic, category-diverse reviews. Avatars from Unsplash portrait crops.
const AVATAR = "?auto=format&fit=crop&crop=faces&w=120&h=120&q=80";
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aisha Rahman",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" + AVATAR,
    category: "Fashion",
    review:
      "The fabric quality genuinely surprised me — it drapes beautifully and the stitching is flawless. Easily my favorite purchase this year.",
  },
  {
    name: "Daniel Okafor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" + AVATAR,
    category: "Shoes",
    review:
      "Comfortable straight out of the box and they look even better in person. Shipping was fast and the packaging felt premium.",
  },
  {
    name: "Sofia Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" + AVATAR,
    category: "Bags",
    review:
      "This bag holds everything and still looks elegant. The leather is soft yet sturdy — I get compliments every single day.",
  },
  {
    name: "James Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" + AVATAR,
    category: "Electronics",
    review:
      "Sound quality is incredible for the price. Setup took two minutes and the battery easily lasts me a full work week.",
  },
  {
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" + AVATAR,
    category: "Beauty",
    review:
      "My skin has never looked better. Lightweight, non-greasy, and a little goes a long way. Repurchasing without a doubt.",
  },
  {
    name: "Michael Brooks",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7" + AVATAR,
    category: "Watches",
    review:
      "Feels like a luxury piece at a fraction of the cost. The finish is impeccable and it pairs with absolutely everything.",
  },
  {
    name: "Elena Popova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" + AVATAR,
    category: "Home & Living",
    review:
      "Transformed my living room instantly. Beautifully crafted, arrived well-protected, and the color is exactly as pictured.",
  },
  {
    name: "Omar Haddad",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" + AVATAR,
    category: "Accessories",
    review:
      "Exceeded my expectations. Great attention to detail and the customer service was warm and genuinely helpful throughout.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-[var(--color-gold)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[300px] flex-shrink-0 flex-col gap-4 rounded-[22px] border border-[var(--color-line)] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-[350ms] ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:w-[340px]">
      <div className="flex items-center gap-3">
        <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
          <Image src={t.avatar} alt={t.name} fill sizes="48px" className="object-cover" loading="lazy" />
        </span>
        <div className="min-w-0">
          <figcaption className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
            <span className="truncate">{t.name}</span>
            {/* Verified badge */}
            <svg className="h-4 w-4 flex-shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-label="Verified customer">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
            </svg>
          </figcaption>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
            {t.category}
          </p>
        </div>
      </div>

      <Stars />

      <blockquote className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
        &ldquo;{t.review}&rdquo;
      </blockquote>
    </figure>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // ── Drag / swipe support (mirrors CategorySlider) ──
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onPointerDown(e: React.PointerEvent) {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current.scrollLeft;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !trackRef.current) return;
    const delta = startX.current - e.clientX;
    if (Math.abs(delta) > 5) trackRef.current.scrollLeft = scrollLeft.current + delta;
  }
  function onPointerUp() {
    isDragging.current = false;
  }

  // Tripled for a seamless loop, same technique as the category slider.
  const items = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="w-full overflow-hidden py-12">
      {/* Section Header */}
      <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            What Our Customers Say
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Loved by Thousands of Happy Customers
          </h2>
          <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Read genuine experiences and reviews from customers who have purchased and enjoyed our products.
          </p>
        </div>
      </div>

      {/* Infinite auto-scrolling carousel (left → right) */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-[var(--color-surface)] to-transparent sm:w-24" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[var(--color-surface)] to-transparent sm:w-24" aria-hidden="true" />

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="flex cursor-grab overflow-x-auto scrollbar-hide select-none active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          aria-label="Customer testimonials carousel"
        >
          <div
            className={cn("flex gap-5 px-4 py-3", "testimonial-marquee", paused && "testimonial-marquee-paused")}
            aria-hidden="true"
          >
            {items.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Accessible static list for screen readers */}
      <ul className="sr-only">
        {TESTIMONIALS.map((t) => (
          <li key={t.name}>
            {t.name} ({t.category}) — 5 stars: {t.review}
          </li>
        ))}
      </ul>
    </section>
  );
}
