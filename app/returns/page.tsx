import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Learn about our straightforward 30-day return policy and refunds process.",
  openGraph: {
    title: "Returns & Refunds",
    description: "Learn about our straightforward 30-day return policy and refunds process.",
  },
  twitter: {
    title: "Returns & Refunds",
    description: "Learn about our straightforward 30-day return policy and refunds process.",
  },
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Customer Support"
      title="Returns & Refund Policy"
      updated="June 24, 2026"
      intro="Not quite right? No problem. We offer a straightforward 30-day return policy so you can shop with complete confidence."
      sections={[
        {
          title: "30-Day Return Window",
          body: "You may return most items within 30 days of delivery for a full refund. Items must be unused, in their original condition, and returned with all original packaging and tags attached.",
        },
        {
          title: "How to Start a Return",
          body: "Visit our Contact page or your account's order history and select the item you'd like to return. We'll email you a prepaid return label and step-by-step instructions. Pack the item securely and drop it at any authorized carrier location.",
        },
        {
          title: "Refund Processing",
          body: "Once we receive and inspect your return, refunds are issued to your original payment method within 5–7 business days. You'll receive an email confirmation when your refund is processed. Original shipping charges are non-refundable unless the return is due to our error.",
        },
        {
          title: "Exchanges",
          body: "Prefer a different size or color? Start an exchange from your order history. If the replacement item differs in price, we'll refund or charge the difference. Exchanges ship as soon as we receive your original item.",
        },
        {
          title: "Non-Returnable Items",
          body: "For hygiene and safety reasons, the following cannot be returned: opened beauty and skincare products, pierced jewelry, intimate apparel, and gift cards. Final-sale items are clearly marked at checkout.",
        },
        {
          title: "Damaged or Incorrect Items",
          body: "If your order arrives damaged or you received the wrong item, contact us within 48 hours of delivery with a photo. We'll arrange a free replacement or full refund right away — no need to return the faulty item first in most cases.",
        },
      ]}
    />
  );
}
