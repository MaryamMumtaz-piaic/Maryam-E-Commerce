"use client";

import { useEffect } from "react";
import { useRecentlyViewed, type RecentItem } from "@/lib/store/recentlyViewed";

export function RecordView({ item }: { item: RecentItem }) {
  const record = useRecentlyViewed((s) => s.record);
  useEffect(() => {
    record(item);
    // Only re-run when the product identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  return null;
}
