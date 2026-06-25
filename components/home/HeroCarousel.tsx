"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image: string;
};

export function HeroCarousel({
  slides,
  intervalMs = 6000,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slides.length, intervalMs]);

  return (
    <section
      className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
            <div className={cn("max-w-xl", i === index && "animate-fade-in")}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                {slide.eyebrow}
              </p>
              <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-md text-base text-white/80 sm:text-lg">
                {slide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={slide.cta.href} variant="gold" size="lg">
                  {slide.cta.label}
                  <ArrowRight className="h-4.5 w-4.5" />
                </ButtonLink>
                <Link
                  href="/products"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 p-2.5 text-white backdrop-blur transition hover:bg-white/10 sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 p-2.5 text-white backdrop-blur transition hover:bg-white/10 sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-8 bg-[var(--color-gold)]" : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
