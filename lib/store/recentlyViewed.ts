"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  image: string;
  categoryName: string;
};

const MAX_ITEMS = 12;

type RecentState = {
  items: RecentItem[];
  record: (item: RecentItem) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      items: [],
      record: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "maryam-recently-viewed" },
  ),
);
