import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata = { title: "Secure Checkout" };

export default function SecureCheckoutPage() {
  return (
    <PolicyPage
      eyebrow="Payment & Checkout"
      title="Secure Checkout"
      updated="June 24, 2026"
      intro="Shopping with Maryam is safe from cart to confirmation. Here's how we protect every step of your checkout."
      sections={[
        {
          title: "Encrypted Connections",
          body: "Your entire session is protected by TLS/SSL encryption. The padlock in your browser's address bar confirms that all data exchanged between you and our store is scrambled and unreadable to third parties.",
        },
        {
          title: "PCI-DSS Compliant Processing",
          body: "Payments are handled by Stripe, a globally trusted, PCI-DSS Level 1 certified processor. Card details are tokenized and never touch or reside on our servers.",
        },
        {
          title: "Fraud Protection",
          body: "Our payment provider runs advanced fraud detection on every transaction, using machine learning to flag suspicious activity and protect both you and your account from unauthorized use.",
        },
        {
          title: "Secure Authentication",
          body: "For added protection, eligible transactions use 3-D Secure (such as Visa Secure and Mastercard Identity Check), prompting you to verify your identity directly with your bank.",
        },
        {
          title: "Privacy by Design",
          body: "We collect only the information required to complete your purchase and deliver your order. We never sell your data, and we store it only as long as necessary. See our Privacy Policy for full details.",
        },
        {
          title: "Peace of Mind",
          body: "If you ever notice anything unusual about a transaction, contact us immediately. Our support team will help investigate and resolve any concern quickly.",
        },
      ]}
    />
  );
}
