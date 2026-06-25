import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductToolbar } from "@/components/product/ProductToolbar";
import { Pagination } from "@/components/product/Pagination";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata = { title: "Shop" };

const PAGE_SIZE = 24;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({
      search: sp.search,
      category: sp.category,
      sort: sp.sort as "newest" | "price-asc" | "price-desc" | "rating" | undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Shop"
        title={sp.search ? `Results for “${sp.search}”` : "All products"}
        description="Browse the full Maryam collection."
      />

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink">Categories</p>
          <ul className="mt-4 flex flex-col gap-1">
            <li>
              <Link
                href="/products"
                className={`block rounded-lg px-3 py-2 text-sm ${!sp.category ? "bg-surface-alt font-medium text-ink" : "text-ink-soft hover:bg-surface-alt"}`}
              >
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm ${sp.category === c.slug ? "bg-surface-alt font-medium text-ink" : "text-ink-soft hover:bg-surface-alt"}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <ProductToolbar total={total} />
          <ProductGrid products={products} />
          <Pagination
            page={page}
            totalPages={totalPages}
            baseParams={{ search: sp.search, sort: sp.sort, category: sp.category }}
          />
        </div>
      </div>
    </Section>
  );
}
