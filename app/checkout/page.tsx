import { auth } from "@/auth";
import { Section } from "@/components/ui/Section";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with our secure checkout process.",
  openGraph: {
    title: "Checkout",
    description: "Complete your order with our secure checkout process.",
  },
  twitter: {
    title: "Checkout",
    description: "Complete your order with our secure checkout process.",
  },
};

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
