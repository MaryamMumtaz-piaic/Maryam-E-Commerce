"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast, type Toast } from "@/lib/store/toast";
import { CloseIcon } from "@/components/ui/icons";

const VISIBLE_MS = 3500; // auto-dismiss window
const EXIT_MS = 300; // must match .animate-toast-out duration

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToast((s) => s.dismiss);
  const [leaving, setLeaving] = useState(false);

  // Play the exit animation, then remove from the store.
  const close = () => {
    setLeaving(true);
    setTimeout(() => dismiss(toast.id), EXIT_MS);
  };

  useEffect(() => {
    const t = setTimeout(close, VISIBLE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-3 shadow-xl ${
        leaving ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      {/* Success check */}
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>

      {/* Optional product thumbnail */}
      {toast.image && (
        <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-alt)]">
          <Image src={toast.image} alt="" fill sizes="40px" className="object-cover" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">Added to cart</p>
        <p className="truncate text-xs text-[var(--color-ink-soft)]">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss notification"
        className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors duration-200 hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-ink)]"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToast((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2.5 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
