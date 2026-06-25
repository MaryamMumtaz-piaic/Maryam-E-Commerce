import type { ReviewView } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/lib/utils";

export function ReviewList({ reviews }: { reviews: ReviewView[] }) {
  if (reviews.length === 0) {
    return <p className="text-ink-soft">No reviews yet. Be the first to share your thoughts.</p>;
  }
  return (
    <ul className="flex flex-col divide-y divide-line">
      {reviews.map((r) => (
        <li key={r.id} className="py-6 first:pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-gold-soft)] text-sm font-semibold text-[var(--color-gold-dark)]">
                {r.authorName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{r.authorName}</p>
                <p className="text-xs text-ink-soft">{formatDate(r.createdAt)}</p>
              </div>
            </div>
            <Rating value={r.rating} />
          </div>
          {r.title && <p className="mt-3 text-sm font-semibold text-ink">{r.title}</p>}
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{r.body}</p>
        </li>
      ))}
    </ul>
  );
}
