"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  image?: string;
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
};

// Monotonic id counter — avoids Date.now()/Math.random() and guarantees unique,
// stable keys even when several toasts are pushed in the same tick.
let nextId = 1;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
