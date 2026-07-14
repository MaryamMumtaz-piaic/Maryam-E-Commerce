import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Understand how we use cookies to improve your shopping experience.",
  openGraph: {
    title: "Cookie Policy",
    description: "Understand how we use cookies to improve your shopping experience.",
  },
  twitter: {
    title: "Cookie Policy",
    description: "Understand how we use cookies to improve your shopping experience.",
  },
};

export default function CookiesPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Cookie Policy"
      updated="June 24, 2026"
      intro="This policy explains how Maryam uses cookies and similar technologies to recognize you when you visit, and how you can control them."
      sections={[
        {
          title: "What Are Cookies?",
          body: "Cookies are small text files stored on your device when you visit a website. They help the site remember your actions and preferences — such as what's in your cart — over time so you don't have to re-enter them.",
        },
        {
          title: "Essential Cookies",
          body: "These are necessary for the store to function. They keep your shopping cart intact, maintain your login session, and enable secure checkout. The store cannot work properly without them, so they cannot be switched off.",
        },
        {
          title: "Preference Cookies",
          body: "These remember choices you make — like your region, language, or recently viewed products — to give you a more personalized experience on return visits.",
        },
        {
          title: "Analytics Cookies",
          body: "We use these to understand how visitors interact with the store, which pages are most popular, and where improvements are needed. All analytics data is aggregated and anonymized.",
        },
        {
          title: "Managing Cookies",
          body: "You can accept or reject non-essential cookies at any time through your browser settings. Most browsers let you block or delete cookies. Note that disabling essential cookies may affect core features like your cart and checkout.",
        },
        {
          title: "Third-Party Cookies",
          body: "Some cookies are set by trusted partners, such as our payment processor and analytics provider. These partners have their own privacy and cookie policies governing their use of your data.",
        },
      ]}
    />
  );
}
