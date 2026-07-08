import Link from "next/link";
import type { CategoryView } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { Newsletter } from "@/components/layout/Newsletter";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
  ShieldIcon,
  VisaMark,
  MastercardMark,
  AmexMark,
  PaypalMark,
  ApplePayMark,
  GooglePayMark,
} from "@/components/ui/icons";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "X (Twitter)", href: "https://x.com", Icon: XIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YouTubeIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Featured Products", href: "/#featured" },
  { label: "Top Selling", href: "/#top-selling" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=rating" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Founder", href: "/founder" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "Shipping Information", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Order Tracking", href: "/track" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/legal" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Cancellation Policy", href: "/cancellation" },
];

const PAYMENT_LINKS = [
  { label: "Payment Methods", href: "/payment-methods" },
  { label: "Secure Checkout", href: "/secure-checkout" },
  { label: "Billing Information", href: "/billing" },
  { label: "Delivery Information", href: "/delivery" },
];

const PAYMENT_MARKS = [VisaMark, MastercardMark, AmexMark, PaypalMark, ApplePayMark, GooglePayMark];

export function Footer({ categories }: { categories: CategoryView[] }) {
  const year = 2026;

  return (
    <footer className="mt-24 border-t border-line bg-surface-alt">
      {/* ── Top band: brand + newsletter ── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 border-b border-line pb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Premium products curated for modern lifestyles. Shop quality, style, and
              value — all in one place.
            </p>
            <p className="mt-3 text-sm font-medium italic text-[var(--color-gold-dark)]">
              Considered goods for a calmer way to shop.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white hover:shadow-md"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <Newsletter />
        </div>

        {/* ── Link grid ── */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-5">
          <FooterCol title="Quick Links">
            {QUICK_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            {COMPANY_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Support">
            {SUPPORT_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Payment & Checkout">
            {PAYMENT_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Shop by Category">
            {categories.length > 0 ? (
              categories.map((c) => (
                <FooterLink key={c.id} href={`/categories/${c.slug}`}>
                  {c.name}
                </FooterLink>
              ))
            ) : (
              <FooterLink href="/products">All products</FooterLink>
            )}
          </FooterCol>
        </div>

        {/* ── Payment strip ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <ShieldIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
            <span>Secure payments — your data is encrypted and protected.</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_MARKS.map((Mark, i) => (
              <Mark key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-soft sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Maryam Shop. All Rights Reserved.</p>
          <p>
            Designed by <span className="font-semibold text-ink">Maryam Muftaz</span> ·{" "}
            <Link href="/" className="transition hover:text-ink">
              Maryam Shop
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="transition hover:text-ink">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/legal" className="transition hover:text-ink">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/cookies" className="transition hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block text-sm text-ink-soft transition-all duration-200 hover:translate-x-0.5 hover:text-ink"
      >
        {children}
      </Link>
    </li>
  );
}
