"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import type { CategoryView } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "./SearchBar";
import { NavActions } from "./NavActions";
import { UserMenu } from "./UserMenu";
import { MenuIcon, CloseIcon, LoginIcon, UserPlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const STATIC_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({
  categories,
  session,
}: {
  categories: CategoryView[];
  session: Session | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: logo + mobile menu toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-surface-alt active:scale-95 lg:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        {/* Center: nav links */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {STATIC_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={pathname === l.href}>
              {l.label}
            </NavLink>
          ))}
          <div className="group relative">
            <NavLink href="/products" active={pathname.startsWith("/categories")}>
              Categories
            </NavLink>
            {/* Elegant Dropdown for Categories */}
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
              <div className="rounded-2xl border border-line bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition-colors duration-150 hover:bg-surface-alt hover:text-[var(--color-gold-dark)]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right: Search + Cart/Wishlist + Auth/User Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          <SearchBar />
          <NavActions />
          <UserMenu user={session?.user ?? null} />
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-white animate-fade-in lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-1">
              {STATIC_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                    pathname === l.href ? "bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]" : "text-ink hover:bg-surface-alt"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Categories
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                    pathname === `/categories/${c.slug}` ? "bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]" : "text-ink hover:bg-surface-alt"
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            {!session?.user && (
              <div className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5 px-3">
                <Link
                  href="/login"
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-line text-xs font-semibold uppercase tracking-widest text-ink transition-colors duration-200 hover:bg-surface-alt"
                >
                  <LoginIcon className="h-4.5 w-4.5 text-ink-soft" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-black"
                >
                  <span>Create Account</span>
                  <UserPlusIcon className="h-4.5 w-4.5" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
        active
          ? "bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]"
          : "text-ink hover:bg-surface-alt hover:text-black"
      )}
    >
      {children}
    </Link>
  );
}
