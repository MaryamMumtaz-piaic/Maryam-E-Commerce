"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useToast } from "./toast";

// Per-product sliding-window rate limiter for success toasts only (never gates
// the cart mutation). Keeps at most MAX_TOASTS notifications per product within
// any WINDOW_MS span, so rapid repeated clicks don't flood the screen.
const WINDOW_MS = 6000;
const MAX_TOASTS = 5;
const toastTimestamps = new Map<string, number[]>();

function shouldShowToast(productId: string): boolean {
  const now = Date.now();
  const recent = (toastTimestamps.get(productId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_TOASTS) {
    toastTimestamps.set(productId, recent);
    return false;
  }
  recent.push(now);
  toastTimestamps.set(productId, recent);
  return true;
}

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.stock, i.quantity + qty) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: Math.min(item.stock, qty) }] };
        });
        // Fire a success toast from the single choke point every "Add to Cart"
        // button already calls — so feedback is consistent across all pages.
        // Rate-limited per product so rapid repeated clicks don't flood the UI.
        if (shouldShowToast(item.id)) {
          useToast.getState().show({
            message: `${item.name} added to cart`,
            image: item.image,
          });
        }
      },
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, Math.min(i.stock, qty)) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "maryam-cart" },
  ),
);
