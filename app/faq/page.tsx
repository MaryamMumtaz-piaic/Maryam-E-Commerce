import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion, type FaqGroup } from "@/components/faq/FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently Asked Questions about orders, shipping, returns, and payments.",
  openGraph: {
    title: "FAQ",
    description: "Frequently Asked Questions about orders, shipping, returns, and payments.",
  },
  twitter: {
    title: "FAQ",
    description: "Frequently Asked Questions about orders, shipping, returns, and payments.",
  },
};

const GROUPS: FaqGroup[] = [
  {
    category: "Orders",
    items: [
      { q: "How do I place an order?", a: "Browse the catalog, add items to your cart, and proceed to checkout. Enter your shipping and payment details, review your order, and confirm. You'll receive an email confirmation right away." },
      { q: "Can I change or cancel my order?", a: "Yes — you can cancel or modify an order any time before it ships, from your order history or via the Contact page. Once dispatched, you can return it under our 30-day policy." },
      { q: "How do I know my order was successful?", a: "You'll receive an order confirmation email within minutes. You can also see all your orders and their status in your account's order history." },
      { q: "Do I need an account to shop?", a: "You can browse freely, but an account lets you track orders, save a wishlist, check out faster, and view your full purchase history." },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      { q: "How long does delivery take?", a: "Standard shipping takes 3–5 business days, express 1–2 business days, and international orders 7–14 business days depending on destination." },
      { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. Import duties and taxes may apply and are the recipient's responsibility." },
      { q: "Is shipping free?", a: "Standard shipping is free on all orders over $75. Below that, a flat $6.95 rate applies. Express and international rates are shown at checkout." },
      { q: "How do I track my order?", a: "Use the tracking number in your shipping confirmation email, or visit our Order Tracking page to follow your parcel in real time." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "Most items can be returned within 30 days of delivery, provided they're unused and in original condition with tags and packaging." },
      { q: "How long do refunds take?", a: "Once we receive and inspect your return, refunds are issued to your original payment method within 5–7 business days." },
      { q: "Can I exchange an item?", a: "Yes — start an exchange from your order history. If the new item differs in price, we'll refund or charge the difference." },
      { q: "What can't be returned?", a: "For hygiene reasons, opened beauty products, pierced jewelry, intimate apparel, and gift cards are non-returnable. Final-sale items are marked at checkout." },
    ],
  },
  {
    category: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All payments are securely processed by Stripe." },
      { q: "Is it safe to pay on your site?", a: "Absolutely. Your connection is encrypted with TLS/SSL and payments are handled by PCI-DSS compliant Stripe. We never store your full card details." },
      { q: "When am I charged?", a: "Your card is authorized at checkout and charged once your order is confirmed. Pre-orders are charged when the item is ready to ship." },
    ],
  },
  {
    category: "Account",
    items: [
      { q: "How do I reset my password?", a: "On the sign-in page, choose 'Forgot password' and follow the emailed link to set a new one." },
      { q: "How do I update my details?", a: "Sign in and open your account settings to update your name, email, addresses, and saved payment methods." },
      { q: "How do I delete my account?", a: "Contact us via the Contact page and we'll process your account deletion request within 30 days, in line with our Privacy Policy." },
    ],
  },
];

export default function FaqPage() {
  return (
    <Section className="max-w-3xl py-12">
      <SectionHeading
        eyebrow="Help & Support"
        title="Frequently Asked Questions"
        description="Answers to the questions we hear most. Can't find what you need? Reach out via our Contact page."
      />
      <FaqAccordion groups={GROUPS} />
    </Section>
  );
}
