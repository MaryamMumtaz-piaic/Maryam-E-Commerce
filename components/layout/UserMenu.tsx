"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { UserIcon } from "@/components/ui/icons";

type SessionUser = { name?: string | null; email?: string | null; role?: string } | null;

export function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <div className="hidden items-center gap-2 pl-1 sm:flex">
        <Link
          href="/login"
          className="rounded-full px-3 py-2 text-sm font-medium text-ink hover:text-[var(--color-gold-dark)]"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-gold-soft)] text-sm font-semibold text-[var(--color-gold-dark)] transition hover:ring-2 hover:ring-[var(--color-gold)]"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-line bg-white p-2 shadow-lg shadow-black/5">
          <div className="border-b border-line px-3 pb-2.5 pt-1.5">
            <p className="truncate text-sm font-medium text-ink">{user.name ?? "Account"}</p>
            <p className="truncate text-xs text-ink-soft">{user.email}</p>
          </div>
          <div className="flex flex-col py-1">
            <MenuLink href="/profile">
              <UserIcon className="h-4 w-4" /> Profile
            </MenuLink>
            <MenuLink href="/orders">Orders</MenuLink>
            <MenuLink href="/wishlist">Wishlist</MenuLink>
            {isAdmin && (
              <MenuLink href="/admin" highlight>
                Admin Dashboard
              </MenuLink>
            )}
          </div>
          <div className="border-t border-line pt-1">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface-alt"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  children,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-alt " +
        (highlight ? "font-medium text-[var(--color-gold-dark)]" : "text-ink")
      }
    >
      {children}
    </Link>
  );
}
