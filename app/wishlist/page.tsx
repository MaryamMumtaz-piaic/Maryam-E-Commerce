import { Section } from "@/components/ui/Section";
import { WishlistView } from "@/components/cart/WishlistView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Manage your saved items and shop your favorites later.",
  openGraph: {
    title: "Wishlist",
    description: "Manage your saved items and shop your favorites later.",
  },
  twitter: {
    title: "Wishlist",
    description: "Manage your saved items and shop your favorites later.",
  },
};

export default function WishlistPage() {
  return (
    <Section className="py-12">
      <h1 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">Your Wishlist</h1>
      <WishlistView />
    </Section>
  );
}
