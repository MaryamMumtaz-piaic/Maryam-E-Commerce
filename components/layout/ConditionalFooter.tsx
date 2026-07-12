"use client";

import { usePathname } from "next/navigation";
import type { CategoryView } from "@/lib/types";
import { Footer } from "@/components/layout/Footer";

const HIDDEN_ON = ["/login", "/signup"];

export function ConditionalFooter({ categories }: { categories: CategoryView[] }) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <Footer categories={categories} />;
}
