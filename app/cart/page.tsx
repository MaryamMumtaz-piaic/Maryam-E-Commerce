import { Section } from "@/components/ui/Section";
import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <Section className="py-12">
      <h1 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">Your Cart</h1>
      <CartView />
    </Section>
  );
}
