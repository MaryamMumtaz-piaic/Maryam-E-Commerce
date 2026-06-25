import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        STYLES[status] ?? STYLES.PROCESSING,
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
