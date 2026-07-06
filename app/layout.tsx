import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
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
          <AnnouncementBar />
          <Navbar categories={categories} session={session} />
          <main>{children}</main>
          <Footer categories={categories} />
          <ChatWidget userName={session?.user?.name ?? null} />
        </Providers>
      </body>
    </html>
  );
}
