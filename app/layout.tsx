import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/layout/ConditionalHeader";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Providers } from "@/components/providers/Providers";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getCategories } from "@/lib/data";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "Maryam — Considered Goods",
    template: "%s · Maryam",
  },
  description:
    "Maryam is a curated store of refined apparel, footwear, accessories, and home goods. Timeless design, premium materials.",
  keywords: ["Maryam", "ecommerce", "apparel", "accessories", "home goods"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <Providers>
          <ConditionalHeader categories={categories} session={session} />
          <main>{children}</main>
          <ConditionalFooter categories={categories} />
          <ChatWidget userName={session?.user?.name ?? null} />
        </Providers>
      </body>
    </html>
  );
}
