"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CategoryView } from "@/lib/types";

// ─── Curated category data with premium Unsplash images ──────────────────────
const CATEGORY_IMG = "?auto=format&fit=crop&q=80&w=480&h=600";

const CURATED: Record<string, { image: string; label?: string }> = {
  jewelry: {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" + CATEGORY_IMG,
  },
  bags: {
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa" + CATEGORY_IMG,
  },
  shoes: {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" + CATEGORY_IMG,
  },
  electronics: {
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661" + CATEGORY_IMG,
  },
  watches: {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" + CATEGORY_IMG,
  },
  beauty: {
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" + CATEGORY_IMG,
  },
  fashion: {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b" + CATEGORY_IMG,
  },
  "home-decor": {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" + CATEGORY_IMG,
    label: "Home Decor",
  },
  "home-living": {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" + CATEGORY_IMG,
    label: "Home & Living",
  },
  perfumes: {
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539" + CATEGORY_IMG,
  },
  sunglasses: {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f" + CATEGORY_IMG,
  },
  apparel: {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050" + CATEGORY_IMG,
  },
  accessories: {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b" + CATEGORY_IMG,
  },
};

// Fallback for uncatalogued slugs
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30" + CATEGORY_IMG;

function getImage(slug: string, dbImage: string | null): string {
  const curated = CURATED[slug.toLowerCase()];
  return curated?.image ?? dbImage ?? FALLBACK_IMAGE;
}

function getLabel(slug: string, name: string): string {
  return CURATED[slug.toLowerCase()]?.label ?? name;
}

// ─── Individual category card ─────────────────────────────────────────────────
function CategoryCard({ category }: { category: CategoryView }) {
  const image = getImage(category.slug, category.image);
  const label = getLabel(category.slug, category.name);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="category-card group relative flex-shrink-0 w-[180px] sm:w-[210px] lg:w-[230px] overflow-hidden rounded-[20px] bg-surface-alt border border-ink/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)] transition-shadow duration-400"
      tabIndex={0}
      aria-label={`Shop ${label} — ${category.productCount} products`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 210px, 230px"
          className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
          loading="lazy"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Text overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60 mb-0.5">
          {category.productCount} items
        </p>
        <div className="flex items-end justify-between gap-2">
          <h3 className="font-serif text-[1.05rem] font-semibold leading-tight text-white">
            {label}
          </h3>
          {/* Animated arrow — moves right on hover */}
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 ease-out group-hover:bg-[var(--color-gold)] group-hover:border-[var(--color-gold)] group-hover:translate-x-0.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {/* Gold underline on hover */}
        <div className="mt-2 h-[2px] w-0 rounded-full bg-[var(--color-gold)] transition-all duration-400 ease-out group-hover:w-full" />
      </div>
    </Link>
  );
}

// ─── Infinite slider wrapper ──────────────────────────────────────────────────
export function CategorySlider({ categories }: { categories: CategoryView[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // ── Drag-to-scroll (click-safe) ─────────────────────────────
  const isDragging = useRef(false);
  const hasDragged = useRef(false);   // true only if user moved > threshold
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onPointerDown(e: React.PointerEvent) {
    if (!trackRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;       // reset on every new press
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current.scrollLeft;
    // do NOT use setPointerCapture — it intercepts Link clicks
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !trackRef.current) return;
    const delta = startX.current - e.clientX;
    if (Math.abs(delta) > 5) {
      hasDragged.current = true;        // real drag detected
      trackRef.current.scrollLeft = scrollLeft.current + delta;
    }
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  // Swallow click on the track ONLY when user actually dragged
  function onClickCapture(e: React.MouseEvent) {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  }

  // Duplicate array for seamless loop (tripled = 3×)
  const items = [...categories, ...categories, ...categories];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left/right fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[var(--color-surface)] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[var(--color-surface)] to-transparent" aria-hidden="true" />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        className="flex cursor-grab active:cursor-grabbing overflow-x-auto scrollbar-hide select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Category carousel"
      >
        {/* Animated inner track */}
        <div
          className={cn(
            "flex gap-4 sm:gap-5 py-3 px-4",
            "category-marquee",
            paused && "category-marquee-paused",
          )}
          aria-hidden="true"
        >
          {items.map((cat, i) => (
            <CategoryCard key={`${cat.id}-${i}`} category={cat} />
          ))}
        </div>
      </div>

      {/* Accessible (non-animated) version for screen readers / keyboard nav */}
      <ul className="sr-only" aria-label="Shop by category">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/categories/${cat.slug}`}>
              {cat.name} — {cat.productCount} products
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

