import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  return <CheckoutSuccess orderId={sp.order} />;
}
