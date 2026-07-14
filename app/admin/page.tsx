import Link from "next/link";
import { getAdminStats, getAdminOrders } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "Maryam store administration overview and business performance metrics.",
  openGraph: {
    title: "Admin Overview",
    description: "Maryam store administration overview and business performance metrics.",
  },
  twitter: {
    title: "Admin Overview",
    description: "Maryam store administration overview and business performance metrics.",
  },
};

export default async function AdminOverview() {
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders(6)]);

  const cards = [
    { label: "Revenue", value: formatPrice(stats.revenue) },
    { label: "Orders", value: String(stats.orderCount) },
    { label: "Products", value: String(stats.productCount) },
    { label: "Customers", value: String(stats.userCount) },
  ];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-serif text-3xl tracking-tight">Dashboard</h1>
      </div>
      <p className="mb-8 text-sm text-ink-soft">
        {isDbConfigured
          ? "Live data from your database."
          : "Demo data — connect a database to see live orders and sessions."}
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-[var(--radius-card)] border border-line p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">{c.label}</p>
            <p className="mt-2 font-serif text-2xl text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      {stats.processing > 0 && (
        <div className="mt-6 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{stats.processing}</span> order
            {stats.processing === 1 ? "" : "s"} awaiting processing.{" "}
            <Link href="/admin/orders" className="font-medium underline">
              Review now
            </Link>
          </p>
        </div>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-[var(--color-gold-dark)] hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-xs text-ink">{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-ink">{o.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
