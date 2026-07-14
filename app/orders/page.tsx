import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "View your purchase history, order status, and tracking information.",
  openGraph: {
    title: "Your Orders",
    description: "View your purchase history, order status, and tracking information.",
  },
  twitter: {
    title: "Your Orders",
    description: "View your purchase history, order status, and tracking information.",
  },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/orders");

  const orders = isDbConfigured
    ? await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <Section className="py-12">
      <SectionHeading eyebrow="Account" title="Your orders" description="Track and review your purchases." />

      {orders.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line py-20 text-center">
          <p className="text-ink-soft">
            {isDbConfigured ? "You have no orders yet." : "Connect a database to view persisted orders."}
          </p>
          <div className="mt-6">
            <ButtonLink href="/products">Start shopping</ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-[var(--radius-card)] border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    Order #{o.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-ink-soft">{formatDate(o.createdAt.toISOString())}</p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
              <ul className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-sm text-ink-soft">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.name} × {it.quantity}</span>
                    <span>{formatPrice(Number(it.price) * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-right text-sm font-semibold text-ink">
                Total: {formatPrice(Number(o.total))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
