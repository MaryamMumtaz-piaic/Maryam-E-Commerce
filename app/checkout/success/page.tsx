import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Success",
  description: "Thank you for your order! Your purchase has been confirmed.",
  openGraph: {
    title: "Checkout Success",
    description: "Thank you for your order! Your purchase has been confirmed.",
  },
  twitter: {
    title: "Checkout Success",
    description: "Thank you for your order! Your purchase has been confirmed.",
  },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  return <CheckoutSuccess orderId={sp.order} />;
}
