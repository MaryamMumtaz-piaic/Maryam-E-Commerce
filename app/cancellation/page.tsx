import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata = { title: "Cancellation Policy" };

export default function CancellationPage() {
  return (
    <PolicyPage
      eyebrow="Customer Support"
      title="Cancellation Policy"
      updated="June 24, 2026"
      intro="Changed your mind? You can cancel an order before it ships. Here's how our cancellation process works."
      sections={[
        {
          title: "Cancelling Before Dispatch",
          body: "You can cancel your order free of charge any time before it has been dispatched. Because we process orders quickly (usually within 1–2 business days), please request cancellation as soon as possible via your order history or the Contact page.",
        },
        {
          title: "Orders Already Shipped",
          body: "If your order has already shipped, it can no longer be cancelled. Instead, you may refuse delivery or return the item once it arrives under our 30-day Returns & Refund Policy.",
        },
        {
          title: "How to Cancel",
          body: "Go to your account's order history, select the order, and choose 'Cancel order'. If the option is no longer available, the order is already in fulfillment — contact us and we'll do our best to help.",
        },
        {
          title: "Refunds for Cancelled Orders",
          body: "When a cancellation is confirmed before dispatch, your full amount is refunded to the original payment method within 5–7 business days. You'll receive an email confirmation once processed.",
        },
        {
          title: "Made-to-Order & Personalized Items",
          body: "Personalized or made-to-order items enter production immediately and can only be cancelled within 6 hours of purchase. After that, they cannot be cancelled or returned unless faulty.",
        },
      ]}
    />
  );
}
