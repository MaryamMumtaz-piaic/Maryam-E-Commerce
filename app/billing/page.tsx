import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Information",
  description: "Learn about billing procedures, invoicing, and taxes at Maryam.",
  openGraph: {
    title: "Billing Information",
    description: "Learn about billing procedures, invoicing, and taxes at Maryam.",
  },
  twitter: {
    title: "Billing Information",
    description: "Learn about billing procedures, invoicing, and taxes at Maryam.",
  },
};

export default function BillingPage() {
  return (
    <PolicyPage
      eyebrow="Payment & Checkout"
      title="Billing Information"
      updated="June 24, 2026"
      intro="Everything you need to know about how billing works, from invoices to address requirements."
      sections={[
        {
          title: "Billing Address",
          body: "Your billing address must match the address on file with your card issuer. This helps verify your identity and prevent fraud. It can differ from your shipping address if you're sending an order elsewhere.",
        },
        {
          title: "When You're Charged",
          body: "Your payment method is authorized at checkout and charged once your order is confirmed. For pre-orders or back-ordered items, we charge only when the item is ready to ship, unless stated otherwise.",
        },
        {
          title: "Invoices & Receipts",
          body: "A detailed receipt is emailed to you automatically after every purchase. You can also download invoices for any past order from your account's order history at any time.",
        },
        {
          title: "Taxes",
          body: "Applicable sales tax or VAT is calculated at checkout based on your shipping destination and shown clearly before you confirm payment. International customers may owe additional import duties on delivery.",
        },
        {
          title: "Updating Payment Details",
          body: "You can add, update, or remove saved payment methods in your account settings. Your card details are stored securely by our payment processor, never in plain text on our systems.",
        },
        {
          title: "Billing Disputes",
          body: "Notice a charge you don't recognize? Contact us right away via the Contact page with your order number. We'll review the transaction and resolve any discrepancy promptly.",
        },
      ]}
    />
  );
}
