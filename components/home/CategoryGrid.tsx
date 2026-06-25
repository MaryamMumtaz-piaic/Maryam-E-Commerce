import Image from "next/image";
import Link from "next/link";
import type { CategoryView } from "@/lib/types";
import { ArrowRight } from "@/components/ui/icons";

export function CategoryGrid({ categories }: { categories: CategoryView[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c, i) => (
        <Link
          key={c.id}
          href={`/categories/${c.slug}`}
          className="group relative overflow-hidden rounded-[var(--radius-card)] bg-surface-alt"
        >
          <div className="relative aspect-[4/3]">
            {c.image && (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={i < 3}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
            <div>
              <h3 className="font-serif text-2xl text-white">{c.name}</h3>
              <p className="mt-0.5 text-sm text-white/75">{c.productCount} products</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink transition group-hover:bg-[var(--color-gold)] group-hover:text-white">
              <ArrowRight className="h-4.5 w-4.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
