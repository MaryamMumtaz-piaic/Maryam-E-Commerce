import { Logo } from "@/components/ui/Logo";
import { SparkleIcon, ShieldIcon, TruckIcon, CheckIcon } from "@/components/ui/icons";

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
    <div className="flex min-h-screen flex-col overflow-hidden lg:h-screen lg:min-h-0 lg:flex-row">
      {/* ── Left: brand showcase (light / premium) ── */}
      <div className="relative flex min-h-[30vh] flex-col justify-center overflow-hidden bg-[linear-gradient(160deg,#ffffff_0%,#fdfbf6_55%,var(--color-gold-soft)_140%)] px-8 py-12 text-ink lg:min-h-0 lg:w-1/2 lg:px-16">
        {/* Subtle soft glow — single, static, low-key */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--color-gold)]/10 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[var(--color-gold-soft)]/60 blur-[100px]" aria-hidden="true" />

        {/* Minimal geometric accents: thin rings + hairline */}
        <div className="pointer-events-none absolute right-10 top-16 h-40 w-40 rounded-full border border-[var(--color-gold)]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute right-24 top-28 h-24 w-24 rounded-full border border-[var(--color-gold)]/10" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-16 left-16 h-px w-24 bg-gradient-to-r from-[var(--color-gold)]/40 to-transparent" aria-hidden="true" />

        {/* Copy */}
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
          <Logo />

          <span className="animate-auth-rise mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-gold)]/25 bg-white/60 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-dark)] backdrop-blur" style={{ animationDelay: "0.05s" }}>
            <SparkleIcon className="h-3.5 w-3.5" />
            Premium Shopping
          </span>

          <h2 className="animate-auth-rise mt-6 font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl xl:text-[3.5rem]" style={{ animationDelay: "0.15s" }}>
            {heading}
          </h2>

          <p className="animate-auth-rise mt-5 max-w-sm text-[15px] leading-[1.7] text-ink-soft" style={{ animationDelay: "0.25s" }}>
            {description}
          </p>

          {/* Feature highlights — clean horizontal row */}
          <ul className="animate-auth-rise mt-10 flex items-center gap-6 border-t border-[var(--color-gold)]/15 pt-6 text-[13px] font-medium text-ink-soft sm:gap-8" style={{ animationDelay: "0.35s" }}>
            <li className="flex flex-col items-start gap-2">
              <ShieldIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
              Secure Checkout
            </li>
            <li className="flex flex-col items-start gap-2">
              <TruckIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
              Free Shipping
            </li>
            <li className="flex flex-col items-start gap-2">
              <CheckIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
              Curated Quality
            </li>
          </ul>
        </div>
      </div>

      {/* ── Right: form card ── */}
      <div className="flex flex-1 justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:h-full lg:w-1/2 lg:py-6">
        <div className="animate-auth-in my-auto w-full max-w-md rounded-[22px] border border-line bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
