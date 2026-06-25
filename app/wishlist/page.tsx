import { Section } from "@/components/ui/Section";
import { WishlistView } from "@/components/cart/WishlistView";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <Section className="py-12">
      <h1 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">Your Wishlist</h1>
      <WishlistView />
    </Section>
  );
}
