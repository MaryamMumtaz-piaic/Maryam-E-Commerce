import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/ui/Logo";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/sessions", label: "Active Sessions" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-6">
            <Logo />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-gold-dark)]">
              Admin
            </p>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="mt-6 block rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-surface-alt">
            ← Back to store
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile admin nav */}
        <nav className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
