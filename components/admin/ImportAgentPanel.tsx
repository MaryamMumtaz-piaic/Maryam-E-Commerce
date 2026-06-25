"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SparkleIcon } from "@/components/ui/icons";

export function ImportAgentPanel() {
  const [count, setCount] = useState(50);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setResult(null);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });
    const data = await res.json();
    setRunning(false);
    setResult(data.message ?? (res.ok ? "Import complete." : "Import failed."));
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
          <SparkleIcon className="h-5.5 w-5.5" />
        </span>
        <div className="flex-1">
          <h2 className="font-serif text-lg text-ink">Catalog automation agent</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Bulk-generate and import products to simulate a real-time enterprise
            catalog. Mirrors the <code className="rounded bg-white px-1 py-0.5 text-xs">npm run seed</code> import pipeline.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink-soft">Products to import</span>
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="h-9 w-24 rounded-full border border-line bg-white px-3 text-sm focus:border-[var(--color-gold)] focus:outline-none"
              />
            </label>
            <Button onClick={run} disabled={running} size="sm" variant="gold">
              {running ? "Importing…" : "Run import"}
            </Button>
          </div>

          {result && (
            <p className="mt-4 rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink">
              {result}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
