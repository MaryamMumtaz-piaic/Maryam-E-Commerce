"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type SessionUser = { name?: string | null; email?: string | null; role?: string } | null;

// Premium custom icons for menu items
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!user) {
    return (
      <div className="hidden items-center gap-2 pl-1 sm:flex">
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-all duration-200 hover:text-[var(--color-gold-dark)] hover:bg-surface-alt active:scale-95"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-gold-dark)] hover:shadow-[0_4px_12px_rgba(200,162,75,0.25)] active:scale-95"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
  const isAdmin = user.role === "ADMIN";

  const menuItems = [
    { label: "My Account", href: "/profile", icon: <ProfileIcon /> },
    { label: "Profile Settings", href: "/profile", icon: <SettingsIcon /> },
    { label: "Orders", href: "/orders", icon: <OrdersIcon /> },
    { label: "Wishlist", href: "/wishlist", icon: <WishlistIcon /> },
    { label: "Addresses", href: "/profile#addresses", icon: <AddressIcon /> },
    { label: "Notifications", href: "/profile#notifications", icon: <BellIcon /> },
    ...(isAdmin ? [{ label: "Admin Dashboard", href: "/admin", icon: <SettingsIcon />, highlight: true }] : []),
  ];

  // Total items in focus list: menuItems length + 1 (for Sign Out button)
  const totalFocusable = menuItems.length + 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFocusIdx(0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIdx((i) => Math.min(i + 1, totalFocusable - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  // Focus tracking
  useEffect(() => {
    if (!open || focusIdx < 0) return;
    const elements = listRef.current?.querySelectorAll('[role="menuitem"], [role="button"]');
    if (elements && elements[focusIdx]) {
      (elements[focusIdx] as HTMLElement).focus();
    }
  }, [open, focusIdx]);

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* User Avatar Button */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setFocusIdx(0);
        }}
        aria-label="Account menu"
        className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-gold-soft)] text-sm font-semibold text-[var(--color-gold-dark)] transition duration-200 hover:ring-2 hover:ring-[var(--color-gold)] hover:scale-105 active:scale-95"
      >
        {initial}
      </button>

      {/* Floating Dropdown Panel */}
      <div
        ref={listRef}
        role="menu"
        className={cn(
          "absolute right-0 top-full z-[60] mt-2 w-64 origin-top-right rounded-2xl border border-line bg-white p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 -translate-y-1"
        )}
      >
        {/* User Info Header */}
        <div className="flex items-center gap-3 border-b border-line px-3.5 pb-3 pt-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-soft)] text-sm font-bold text-[var(--color-gold-dark)]">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink leading-tight">{user.name ?? "Account"}</p>
            <p className="truncate text-xs text-ink-soft leading-tight mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex flex-col gap-0.5 py-1.5">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              onFocus={() => setFocusIdx(index)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 outline-none",
                item.highlight
                  ? "font-medium text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-soft)]"
                  : "text-ink hover:bg-surface-alt hover:text-black focus:bg-surface-alt focus:text-black"
              )}
            >
              <span className="text-ink-soft">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Sign Out Button Footer */}
        <div className="border-t border-line pt-1.5 mt-0.5">
          <button
            type="button"
            role="button"
            tabIndex={open ? 0 : -1}
            onFocus={() => setFocusIdx(menuItems.length)}
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition-all duration-150 hover:bg-red-50 focus:bg-red-50 outline-none"
          >
            <SignOutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
