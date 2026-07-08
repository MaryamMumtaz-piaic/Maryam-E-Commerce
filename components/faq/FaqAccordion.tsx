"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type FaqGroup = {
  category: string;
  items: { q: string; a: string }[];
};

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[15px] font-medium text-ink">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-ink-soft transition-transform duration-300",
            open && "rotate-180 text-[var(--color-gold-dark)]",
          )}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <p className="min-h-0 leading-relaxed text-ink-soft">{a}</p>
      </div>
    </div>
  );
}

export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <div key={group.category}>
          <h2 className="mb-2 font-serif text-2xl tracking-tight text-ink">{group.category}</h2>
          <div className="border-t border-line">
            {group.items.map((item) => (
              <FaqRow key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
