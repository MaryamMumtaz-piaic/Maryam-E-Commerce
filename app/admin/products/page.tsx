import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { ImportAgentPanel } from "@/components/admin/ImportAgentPanel";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin · Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;
  const { products, total } = await getProducts({ page, pageSize: 20 });
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl tracking-tight">Products</h1>
      <p className="mb-6 text-sm text-ink-soft">{total} products in the catalog.</p>

      <ImportAgentPanel />

      <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                      <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                    </span>
                    <Link href={`/products/${p.slug}`} className="font-medium text-ink hover:text-[var(--color-gold-dark)]">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.categoryName}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock > 0 ? "text-ink" : "text-red-600"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.rating.toFixed(1)} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/admin/products?page=${page - 1}`} className="rounded-full border border-line px-4 py-2 text-sm">
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-soft">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/products?page=${page + 1}`} className="rounded-full border border-line px-4 py-2 text-sm">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
