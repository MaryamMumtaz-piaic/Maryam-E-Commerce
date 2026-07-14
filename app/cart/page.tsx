import { Section } from "@/components/ui/Section";
import { CartView } from "@/components/cart/CartView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "View and manage the items in your shopping cart.",
  openGraph: {
    title: "Cart",
    description: "View and manage the items in your shopping cart.",
  },
  twitter: {
    title: "Cart",
    description: "View and manage the items in your shopping cart.",
  },
};

export default function CartPage() {
  return (
    <Section className="py-12">
      <h1 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">Your Cart</h1>
      <CartView />
    </Section>
  );
}
