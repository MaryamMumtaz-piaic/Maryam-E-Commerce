"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
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
  intervalMs = 3000,
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

  const active = slides[index];

  return (
    <section
      className="w-full px-4 pt-4 pb-2 sm:px-6 lg:px-8"
      aria-roledescription="carousel"
    >
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mx-auto max-w-[1500px]"
      >
        {/* Preload all hero images */}
        <div className="hidden" aria-hidden>
          {slides.map((s, i) => (
            <Image key={i} src={s.image} alt="" width={16} height={16} priority={i <= 1} />
          ))}
        </div>

        <div className="grid grid-cols-1 items-center gap-8 py-6 sm:py-8 lg:grid-cols-[45fr_55fr] lg:gap-12 lg:py-10">
          {/* Left: content */}
          <div key={`text-${index}`} className="hero-text order-2 lg:order-1">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              <span className="h-px w-8 bg-[var(--color-gold)]" />
              {active.eyebrow}
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-[3.5rem]">
              {active.title}
            </h1>
            <p className="mt-6 min-h-[3.5rem] max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              {active.subtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink
                href={active.cta.href}
                variant="gold"
                size="lg"
                className="w-full sm:w-auto"
              >
                {active.cta.label}
                <ArrowRight className="h-4.5 w-4.5" />
              </ButtonLink>
              <Link
                href="/products"
                className="inline-flex h-13 w-full items-center justify-center rounded-full border border-ink/15 px-8 text-base font-medium text-ink transition hover:border-ink/40 hover:bg-surface-alt sm:w-auto"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Right: product image only — fixed-size container, identical on every slide */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              {slides.map((slide, i) => (
                <Image
                  key={i}
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={i <= 1}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={cn(
                    "object-cover object-center transition-opacity duration-[600ms] ease-in-out",
                    i === index ? "hero-image opacity-100" : "pointer-events-none opacity-0",
                  )}
                  aria-hidden={i !== index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-8 bg-[var(--color-gold)]"
                  : "w-2.5 bg-ink/20 hover:bg-ink/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
