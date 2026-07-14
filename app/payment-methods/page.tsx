import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Explore the secure payment options available for your purchases.",
  openGraph: {
    title: "Payment Methods",
    description: "Explore the secure payment options available for your purchases.",
  },
  twitter: {
    title: "Payment Methods",
    description: "Explore the secure payment options available for your purchases.",
  },
};

export default function PaymentMethodsPage() {
  return (
    <PolicyPage
      eyebrow="Payment & Checkout"
      title="Payment Methods"
      updated="June 24, 2026"
      intro="We accept a wide range of secure payment options so you can check out with whatever is most convenient for you."
      sections={[
        {
          title: "Credit & Debit Cards",
          body: "We accept all major cards including Visa, Mastercard, and American Express. Your card is charged only once your order is confirmed. All card payments are processed securely through Stripe.",
        },
        {
          title: "Digital Wallets",
          body: "For faster checkout, pay with Apple Pay or Google Pay directly from your device. These options let you complete your purchase in a single tap without entering card details manually.",
        },
        {
          title: "PayPal",
          body: "Prefer PayPal? Select it at checkout to pay using your PayPal balance, linked bank account, or saved cards — with PayPal's own buyer protection applied.",
        },
        {
          title: "Payment Security",
          body: "Every transaction is protected by industry-standard TLS encryption and processed by PCI-DSS compliant providers. We never store your full card number on our servers.",
        },
        {
          title: "Currency & Charges",
          body: "All prices are shown in USD. If you pay with a card issued in another currency, your bank may apply a conversion fee at its own exchange rate. No hidden charges are added by Maryam.",
        },
        {
          title: "Failed or Declined Payments",
          body: "If a payment is declined, double-check your card details and available balance, then try again. If the problem persists, contact your bank or reach out to us via the Contact page for assistance.",
        },
      ]}
    />
  );
}
