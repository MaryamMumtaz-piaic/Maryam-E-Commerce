"use client";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import type { CategoryView } from "@/lib/types";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";

const HIDDEN_ON = ["/login", "/signup"];

export function ConditionalHeader({
  categories,
  session,
}: {
  categories: CategoryView[];
  session: Session | null;
}) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return (
    <>
      <AnnouncementBar />
      <Navbar categories={categories} session={session} />
    </>
  );
}
