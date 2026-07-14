import { Section } from "@/components/ui/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read our terms and conditions for using our website and purchasing products.",
  openGraph: {
    title: "Terms & Conditions",
    description: "Read our terms and conditions for using our website and purchasing products.",
  },
  twitter: {
    title: "Terms & Conditions",
    description: "Read our terms and conditions for using our website and purchasing products.",
  },
};

const SECTIONS = [
  {
    title: "1. Overview",
    body: "These Terms & Conditions govern your use of Maryam (the “Store”) and any purchases made through it. By accessing the Store or placing an order, you agree to these terms. This site is a portfolio showcase; transactions are processed in test mode.",
  },
  {
    title: "2. Orders & Pricing",
    body: "All orders are subject to acceptance and availability. Prices are listed in USD and may change without notice. We reserve the right to refuse or cancel any order, including for suspected fraud or pricing errors.",
  },
  {
    title: "3. Payments",
    body: "Payments are securely processed by Stripe. Maryam does not store your full card details. By submitting payment information you confirm you are authorized to use the selected payment method.",
  },
  {
    title: "4. Shipping & Delivery",
    body: "We offer free standard shipping on orders over $75. Estimated delivery is 3–5 business days for domestic orders. Delivery times are estimates and not guaranteed.",
  },
  {
    title: "5. Returns & Refunds",
    body: "Unused items in original condition may be returned within 30 days of delivery for a full refund, excluding original shipping costs. To start a return, contact us via the Contact page.",
  },
  {
    title: "6. Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorized use.",
  },
  {
    title: "7. Reviews & User Content",
    body: "By submitting a product review you grant Maryam a non-exclusive right to display it. Reviews must be honest and must not contain unlawful, offensive, or infringing content.",
  },
  {
    title: "8. Limitation of Liability",
    body: "The Store is provided “as is.” To the fullest extent permitted by law, Maryam is not liable for indirect or consequential damages arising from your use of the Store.",
  },
  {
    title: "9. Privacy",
    body: "We collect only the information needed to process orders and improve your experience. We do not sell personal data. See the Contact page for privacy-related requests.",
  },
  {
    title: "10. Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the Store after changes constitutes acceptance of the revised Terms.",
  },
];

export default function LegalPage() {
  return (
    <Section className="max-w-3xl py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">Legal</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Terms & Conditions</h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: June 24, 2026</p>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif text-xl text-ink">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
