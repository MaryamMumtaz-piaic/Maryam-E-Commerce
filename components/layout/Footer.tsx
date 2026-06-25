import Link from "next/link";
import type { CategoryView } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";

export function Footer({ categories }: { categories: CategoryView[] }) {
  const year = 2026;
  return (
    <footer className="mt-24 border-t border-line bg-surface-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            Considered goods for everyday life. Timeless design, premium materials,
            and a calmer way to shop.
          </p>
        </div>

        <FooterCol title="Shop">
          <FooterLink href="/products">All products</FooterLink>
          {categories.slice(0, 5).map((c) => (
            <FooterLink key={c.id} href={`/categories/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/legal">Terms & Conditions</FooterLink>
        </FooterCol>

        <FooterCol title="Account">
          <FooterLink href="/login">Sign in</FooterLink>
          <FooterLink href="/signup">Create account</FooterLink>
          <FooterLink href="/cart">Cart</FooterLink>
          <FooterLink href="/wishlist">Wishlist</FooterLink>
        </FooterCol>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-ink-soft sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Maryam. All rights reserved.</p>
          <p>Crafted as a portfolio showcase — built with Next.js & Tailwind.</p>
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
      <Link href={href} className="text-sm text-ink-soft transition hover:text-ink">
        {children}
      </Link>
    </li>
  );
}
