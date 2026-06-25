import { getAdminOrders } from "@/lib/admin-data";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders(100);

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl tracking-tight">Orders</h1>
      <p className="mb-8 text-sm text-ink-soft">
        Monitor purchases and update fulfillment status.
      </p>

      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
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
                <td className="px-4 py-3 text-ink-soft">{o.itemCount}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusControl orderId={o.id} current={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
