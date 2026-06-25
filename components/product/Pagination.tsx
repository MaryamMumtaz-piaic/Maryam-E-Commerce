import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  baseParams,
}: {
  page: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number): string {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) {
      if (v) sp.set(k, v);
    }
    sp.set("page", String(p));
    return `?${sp.toString()}`;
  }

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <Link href={href(page - 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface-alt">
          Previous
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full text-sm transition",
            p === page ? "bg-ink text-white" : "border border-line text-ink hover:bg-surface-alt",
          )}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface-alt">
          Next
        </Link>
      )}
    </nav>
  );
}
