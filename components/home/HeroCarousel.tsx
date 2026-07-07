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

// Promotions use SVG-safe text labels — no emoji (UI/UX Pro Max: no-emoji-icons rule)
const PROMOTIONS = [
  {
    icon: "✦",
    label: "Limited Offer",
    text: "Flat 10% OFF on Leather Bags",
    href: "/categories/accessories",
  },
  {
    icon: "◈",
    label: "Summer Sale",
    text: "50% OFF Summer Collection",
    href: "/categories/apparel",
  },
  {
    icon: "⟶",
    label: "Free Shipping",
    text: "Free Shipping on Orders Above $100",
    href: "/products",
  },
  {
    icon: "◆",
    label: "Exclusive Deal",
    text: "Limited Time Exclusive Deal",
    href: "/categories/electronics",
  },
];

const PROMO_DURATION_MS = 6000;
const PROMO_INTERVAL_MS = 10000;

export function HeroCarousel({
  slides,
  intervalMs = 4500,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const sliderTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setPrevIndex(index);
      setIndex((next + slides.length) % slides.length);
    },
    [index, slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    sliderTimer.current = setInterval(() => {
      setIndex((i) => {
        setPrevIndex(i);
        return (i + 1) % slides.length;
      });
    }, intervalMs);
    return () => {
      if (sliderTimer.current) clearInterval(sliderTimer.current);
    };
  }, [paused, slides.length, intervalMs]);

  const active = slides[index];

  // ── Promo toast state ────────────────────────────────────
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPhase, setPromoPhase] = useState<"hidden" | "in" | "visible" | "out">("hidden");
  const promoCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const promoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promoOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPromo = useCallback(() => {
    setPromoPhase("in");
    setTimeout(() => setPromoPhase("visible"), 50);

    if (promoDismissRef.current) clearTimeout(promoDismissRef.current);
    promoDismissRef.current = setTimeout(() => {
      setPromoPhase("out");
      if (promoOutRef.current) clearTimeout(promoOutRef.current);
      promoOutRef.current = setTimeout(() => setPromoPhase("hidden"), 450);
    }, PROMO_DURATION_MS);
  }, []);

  const dismissPromo = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (promoDismissRef.current) clearTimeout(promoDismissRef.current);
    setPromoPhase("out");
    setTimeout(() => setPromoPhase("hidden"), 450);
  }, []);

  useEffect(() => {
    const initial = setTimeout(showPromo, 3000);

    promoCycleRef.current = setInterval(() => {
      setPromoPhase("out");
      setTimeout(() => {
        setPromoIndex((p) => (p + 1) % PROMOTIONS.length);
        showPromo();
      }, 450);
    }, PROMO_INTERVAL_MS);

    return () => {
      clearTimeout(initial);
      if (promoCycleRef.current) clearInterval(promoCycleRef.current);
      if (promoDismissRef.current) clearTimeout(promoDismissRef.current);
      if (promoOutRef.current) clearTimeout(promoOutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPromoVisible = promoPhase === "in" || promoPhase === "visible";

  return (
    <section
      className="hero-section w-full px-4 pt-8 pb-6 sm:px-6 lg:px-8"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mx-auto max-w-[1440px]"
      >
        {/* Preload all images — performance: lazy-loading non-critical */}
        <div className="hidden" aria-hidden="true">
          {slides.map((s, i) => (
            <Image key={i} src={s.image} alt="" width={16} height={16} priority={i <= 1} />
          ))}
        </div>

        {/* ── Main hero grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[44fr_56fr] lg:gap-16 xl:gap-20">

          {/* ── LEFT: Text content ───────────────────────────── */}
          <div
            key={`text-${index}`}
            className="hero-text order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:py-8"
          >
            {/* Eyebrow label — typographic weight: 500, tight tracking */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className="hidden lg:block h-px w-8 flex-shrink-0 bg-[var(--color-gold)]"
                aria-hidden="true"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
                {active.eyebrow}
              </p>
            </div>

            {/* Heading — Playfair Display, luxury-brand scale */}
            <h1
              className="font-serif text-[2.25rem] font-bold leading-[1.08] tracking-[-0.01em] text-ink
                         sm:text-5xl
                         lg:text-[3.5rem]
                         xl:text-[4rem]"
            >
              {active.title}
            </h1>

            {/* Decorative gold rule below heading */}
            <div
              className="mt-5 mb-5 h-px w-12 bg-gradient-to-r from-[var(--color-gold)] to-transparent"
              aria-hidden="true"
            />

            {/* Subtitle — 1.65 line-height, max 68 chars wide */}
            <p className="max-w-[38ch] text-base leading-[1.65] text-ink-soft sm:text-lg">
              {active.subtitle}
            </p>

            {/* CTA buttons — min 44×44pt touch targets */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <ButtonLink
                href={active.cta.href}
                variant="gold"
                size="lg"
                className="hero-cta-primary w-full sm:w-auto"
              >
                {active.cta.label}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>

              <Link
                href="/products"
                className="hero-cta-secondary inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-ink/15 px-7 text-[15px] font-medium text-ink"
              >
                Explore Collection
              </Link>
            </div>

            {/* Slide counter — accessibility: shows current / total */}
            <p
              className="mt-8 hidden lg:flex items-center gap-2 text-xs text-ink/30 font-medium tracking-widest"
              aria-live="polite"
            >
              <span className="text-ink/60">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-6 bg-ink/20" />
              <span>{String(slides.length).padStart(2, "0")}</span>
            </p>
          </div>

          {/* ── RIGHT: Image card ────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="hero-image-card group relative">
              {/* Outer glow ring — premium depth effect */}
              <div
                className="absolute -inset-px rounded-[26px] bg-gradient-to-br from-[var(--color-gold)]/20 via-transparent to-[var(--color-gold)]/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                aria-hidden="true"
              />

              {/* Card shell */}
              <div className="relative overflow-hidden rounded-[24px] border border-ink/[0.06] bg-[var(--color-surface-alt)] shadow-[0_16px_48px_-12px_rgba(10,10,10,0.1),0_4px_16px_-4px_rgba(10,10,10,0.05)] transition-shadow duration-500 group-hover:shadow-[0_28px_64px_-16px_rgba(10,10,10,0.18),0_8px_24px_-6px_rgba(10,10,10,0.08)]">
                {/* Image wrapper — 16:10 on mobile, 16:9 on sm+ */}
                <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[800ms] ease-out will-change-transform group-hover:scale-[1.04]">
                    {slides.map((slide, i) => (
                      <Image
                        key={i}
                        src={slide.image}
                        alt={i === index ? slide.title : ""}
                        fill
                        priority={i <= 1}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 55vw"
                        className={cn(
                          "object-cover object-center transition-opacity duration-700 ease-in-out will-change-[opacity]",
                          i === index ? "hero-image opacity-100" : "pointer-events-none opacity-0",
                        )}
                        aria-hidden={i !== index}
                      />
                    ))}
                  </div>

                  {/* Vignette overlay — draws eye to center */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Slide label overlay — bottom-left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2" aria-hidden="true">
                    <span className="rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1 text-[11px] font-medium tracking-wide text-white">
                      {active.eyebrow}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dot navigation ──────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`View slide: ${slide.title}`}
              onClick={() => go(i)}
              className={cn(
                "h-[5px] rounded-full transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]",
                i === index
                  ? "w-8 bg-[var(--color-gold)]"
                  : "w-[5px] bg-ink/15 hover:bg-ink/35 hover:w-3",
              )}
            />
          ))}
        </div>

        {/* ── Promotional toast (Glassmorphism) ───────────────── */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "absolute right-4 z-40 w-[280px] sm:w-[300px]",
            // Position above dots on mobile, mid-right on desktop
            "bottom-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2",
            "transition-all duration-[450ms]",
            // Spring-like cubic-bezier — UI/UX Pro Max: spring-physics
            isPromoVisible
              ? "translate-x-0 opacity-100 scale-100 pointer-events-auto [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
              : "translate-x-10 opacity-0 scale-95 pointer-events-none [transition-timing-function:cubic-bezier(0.4,0,1,1)]",
          )}
        >
          <Link
            href={PROMOTIONS[promoIndex].href}
            tabIndex={isPromoVisible ? 0 : -1}
            className="promo-card group/promo block relative overflow-hidden rounded-2xl"
          >
            {/* Glassmorphism shell */}
            <div className="absolute inset-0 rounded-2xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]" />

            {/* Gold accent left stripe */}
            <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dark)]" />

            {/* Content */}
            <div className="relative flex items-start gap-3 px-5 py-4 pr-9">
              <div>
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                  {PROMOTIONS[promoIndex].label}
                </p>
                <p className="text-sm font-medium leading-snug text-ink">
                  {PROMOTIONS[promoIndex].text}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-gold)] transition-all duration-200 group-hover/promo:gap-2">
                  Shop now
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Dismiss button — min 44×44pt tap area via padding */}
            <button
              onClick={dismissPromo}
              aria-label="Dismiss promotion"
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-ink/30 hover:bg-black/5 hover:text-ink/60 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-gold)]"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Countdown progress bar */}
            {isPromoVisible && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink/5 overflow-hidden rounded-b-2xl">
                <div
                  key={`${promoIndex}-${promoPhase}`}
                  className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] origin-left promo-progress"
                  style={{ animationDuration: `${PROMO_DURATION_MS}ms` }}
                />
              </div>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
