import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { TruckIcon, ShieldIcon, ChatIcon, ArrowRight, SparkleIcon, CartIcon, UserIcon } from "@/components/ui/icons";

export const metadata = { title: "Help Center" };

const TOPICS = [
  { icon: TruckIcon, title: "Shipping & Delivery", text: "Rates, timelines, and how to track your parcel.", href: "/shipping" },
  { icon: ArrowRight, title: "Returns & Refunds", text: "Start a return, exchange, or request a refund.", href: "/returns" },
  { icon: SparkleIcon, title: "Order Tracking", text: "Follow your order from dispatch to doorstep.", href: "/track" },
  { icon: CartIcon, title: "Payment & Checkout", text: "Accepted methods and secure payment info.", href: "/payment-methods" },
  { icon: ShieldIcon, title: "Privacy & Security", text: "How we protect your data and your account.", href: "/privacy" },
  { icon: UserIcon, title: "FAQ", text: "Quick answers to our most common questions.", href: "/faq" },
];

export default function HelpPage() {
  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="How can we help?"
        title="Help Center"
        description="Find answers, track orders, and get support — all in one place."
        align="center"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="group rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-lg"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
              <t.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-serif text-lg text-ink">{t.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{t.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-gold-dark)] transition-transform duration-300 group-hover:translate-x-0.5">
              Learn more <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-ink px-8 py-12 text-center">
        <ChatIcon className="h-8 w-8 text-[var(--color-gold)]" />
        <h2 className="font-serif text-2xl text-white">Still need help?</h2>
        <p className="max-w-md text-white/75">
          Our support team is here for you. Reach out and we&apos;ll get back to you as soon as possible.
        </p>
        <div className="mt-2">
          <ButtonLink href="/contact" variant="gold" size="lg">
            Contact us <ArrowRight className="h-4.5 w-4.5" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
