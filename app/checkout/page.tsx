import { auth } from "@/auth";
import { Section } from "@/components/ui/Section";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  return (
    <Section className="py-12">
      <h1 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">Checkout</h1>
      <CheckoutView
        defaultEmail={session?.user?.email ?? ""}
        defaultName={session?.user?.name ?? ""}
      />
    </Section>
  );
}
