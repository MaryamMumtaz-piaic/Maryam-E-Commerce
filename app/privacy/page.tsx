import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 24, 2026"
      intro="Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have. This site is a portfolio showcase; transactions run in test mode."
      sections={[
        {
          title: "1. Information We Collect",
          body: "We collect information you provide directly — such as your name, email, shipping address, and order details — as well as limited technical data like your device type, browser, and pages visited, gathered automatically to improve your experience.",
        },
        {
          title: "2. How We Use Your Information",
          body: "We use your information to process and deliver orders, provide customer support, send order updates, and — with your consent — share offers and product news. We also use aggregated analytics to improve the store and its performance.",
        },
        {
          title: "3. Payment Data",
          body: "Payments are processed securely by Stripe. We never see or store your full card number. Stripe handles cardholder data in compliance with PCI-DSS standards.",
        },
        {
          title: "4. Cookies & Tracking",
          body: "We use cookies to keep your cart, remember preferences, and understand how the store is used. You can control cookies through your browser settings. See our Cookie Policy for full details.",
        },
        {
          title: "5. Data Sharing",
          body: "We do not sell your personal data. We share information only with trusted service providers — such as payment processors and shipping carriers — strictly as needed to fulfill your order, and only under confidentiality agreements.",
        },
        {
          title: "6. Your Rights",
          body: "You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us via the Contact page. We'll respond within 30 days.",
        },
        {
          title: "7. Data Retention & Security",
          body: "We retain order data only as long as necessary for legal and operational purposes. We protect your data with encryption in transit, access controls, and regular security reviews.",
        },
        {
          title: "8. Changes to This Policy",
          body: "We may update this Privacy Policy periodically. Material changes will be posted here with a revised date. Continued use of the store constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}
