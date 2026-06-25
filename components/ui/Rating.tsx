import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className={cn("relative inline-block", px)}>
              <Star className={cn(px, "text-line")} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(px, "text-[var(--color-gold)]")} />
              </span>
            </span>
          );
        })}
      </div>
      {count != null && (
        <span className="text-xs text-ink-soft">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}
