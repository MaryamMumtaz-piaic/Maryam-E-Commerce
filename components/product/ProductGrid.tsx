import type { ProductView } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: ProductView[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line py-20 text-center">
        <p className="text-ink-soft">No products found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
