import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { SparkleIcon } from "@/components/ui/icons";

// Floating product cards for the brand showcase. Real Unsplash imagery, sized small.
const FLOATERS = [
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&h=300&q=80",
    label: "Wireless Headphones",
    price: "$149",
    className: "left-[8%] top-[16%] w-40 rotate-[-6deg]",
    delay: "0s",
  },
  {
    src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&h=300&q=80",
    label: "Leather Tote",
    price: "$89",
    className: "right-[10%] top-[12%] w-36 rotate-[7deg]",
    delay: "1.2s",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&h=300&q=80",
    label: "Classic Watch",
    price: "$219",
    className: "left-[14%] bottom-[14%] w-36 rotate-[5deg]",
    delay: "0.6s",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&h=300&q=80",
    label: "Canvas Sneakers",
    price: "$74",
    className: "right-[8%] bottom-[18%] w-40 rotate-[-8deg]",
    delay: "1.8s",
  },
];

export function AuthShell({
  heading,
  description,
  children,
}: {
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* ── Left: brand showcase ── */}
      <div className="animate-auth-gradient relative flex min-h-[38vh] flex-col justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-ink)_0%,#1c1a15_45%,var(--color-gold-dark)_120%)] px-8 py-12 text-white lg:min-h-0 lg:w-1/2 lg:px-14">
        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-gold)]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        {/* Floating product cards (decorative, hidden on small screens) */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {FLOATERS.map((f) => (
            <div
              key={f.label}
              className={`animate-auth-float absolute ${f.className}`}
              style={{ animationDelay: f.delay }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md">
                <div className="relative aspect-square w-full">
                  <Image src={f.src} alt="" fill sizes="160px" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="truncate text-[11px] font-medium text-white/90">{f.label}</span>
                  <span className="text-[11px] font-bold text-[var(--color-gold)]">{f.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="relative z-10 max-w-md">
          <Logo className="[&_span]:text-white" />
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            <SparkleIcon className="h-3.5 w-3.5" />
            Premium Shopping
          </span>
          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">{description}</p>
        </div>
      </div>

      {/* ── Right: form card ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2">
        <div className="animate-auth-in w-full max-w-md rounded-[22px] border border-line bg-white/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-9">
          {children}
        </div>
      </div>
    </div>
  );
}
