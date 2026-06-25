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
import { MenuIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
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
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setOpen(false);
    setShowSearch(false);
  }, [pathname]);

  const topCategories = categories.slice(0, 5);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: logo + mobile menu toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface-alt lg:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        {/* Center: nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {STATIC_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={pathname === l.href}>
              {l.label}
            </NavLink>
          ))}
          <div className="group relative">
            <NavLink href="/products" active={pathname.startsWith("/categories")}>
              Categories
            </NavLink>
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-line bg-white p-2 shadow-lg shadow-black/5">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-surface-alt"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right: search + actions + auth */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Toggle search"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface-alt md:hidden"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <div className="hidden w-56 md:block lg:w-64">
            <SearchBar />
          </div>
          <NavActions />
          <UserMenu user={session?.user ?? null} />
        </div>
      </div>

      {/* Mobile search row */}
      {showSearch && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <SearchBar autoFocus />
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {STATIC_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Categories
            </p>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-alt"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            {session?.user ? (
              <div className="mt-4 flex flex-col gap-1 px-3">
                <Link href="/profile" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt">
                  Profile
                </Link>
                <Link href="/orders" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt">
                  Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-gold-dark)] hover:bg-surface-alt">
                    Admin Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-4 flex gap-2 px-3">
                <Link
                  href="/login"
                  className="flex-1 rounded-full border border-line px-4 py-2.5 text-center text-sm font-medium text-ink"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-full bg-ink px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign up
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
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active ? "text-[var(--color-gold-dark)]" : "text-ink hover:bg-surface-alt",
      )}
    >
      {children}
    </Link>
  );
}
