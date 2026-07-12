import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
  XIcon,
  LinkedInIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Maryam Shop — order support, product questions, or partnerships.",
};

const DETAILS = [
  {
    icon: MailIcon,
    label: "Email",
    value: "hello@maryam.shop",
    href: "mailto:hello@maryam.shop",
    note: "We reply within 1–2 business days",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+1 (555) 014-2200",
    href: "tel:+15550142200",
    note: "Mon–Fri, 9am–6pm EST",
  },
  {
    icon: MapPinIcon,
    label: "Studio",
    value: "24 Atelier Lane, Suite 5\nNew York, NY 10013",
    href: "https://maps.google.com/?q=24+Atelier+Lane+New+York",
    note: "Visits by appointment",
  },
  {
    icon: ClockIcon,
    label: "Hours",
    value: "Mon–Fri · 9am–6pm EST\nWeekends · Closed",
    note: "Holiday hours may vary",
  },
];

const SOCIALS = [
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: XIcon, label: "X", href: "https://x.com" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Standard orders arrive in 3–5 business days. Express delivery is 1–2 business days.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted within 30 days of delivery on unworn items with original packaging.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship to most countries. Duties and taxes are calculated at checkout.",
  },
  {
    q: "How can I track my order?",
    a: "You'll get a tracking link by email once your order ships. Check your account for status too.",
  },
];

export default function ContactPage() {
  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact us"
        description="Questions about an order, a product, or a partnership? We'd love to hear from you — usually back within a business day or two."
      />

      {/* Contact detail cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DETAILS.map((d) => {
          const Icon = d.icon;
          const inner = (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)] transition group-hover:bg-[var(--color-gold)] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{d.label}</p>
                <p className="mt-1 whitespace-pre-line text-sm font-medium text-ink">{d.value}</p>
                <p className="mt-1.5 text-xs text-ink-soft">{d.note}</p>
              </div>
            </>
          );
          const cardCls =
            "group flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--color-gold)]/40 hover:shadow-md";
          return d.href ? (
            <a
              key={d.label}
              href={d.href}
              target={d.href.startsWith("http") ? "_blank" : undefined}
              rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cardCls}
            >
              {inner}
            </a>
          ) : (
            <div key={d.label} className={cardCls}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* Form + aside */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ContactForm />

        <aside className="flex flex-col gap-6">
          {/* Map / location card */}
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-alt">
            <div className="relative h-44 w-full bg-gradient-to-br from-[var(--color-gold-soft)] to-surface-alt">
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--color-gold-dark)] shadow-md">
                  <MapPinIcon className="h-6 w-6" />
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg text-ink">Visit the studio</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">
                24 Atelier Lane, Suite 5{"\n"}New York, NY 10013
              </p>
              <a
                href="https://maps.google.com/?q=24+Atelier+Lane+New+York"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-[var(--color-gold-dark)] hover:underline"
              >
                Get directions →
              </a>
            </div>
          </div>

          {/* Social links */}
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
            <h3 className="font-serif text-lg text-ink">Follow along</h3>
            <p className="mt-1 text-sm text-ink-soft">See new arrivals and behind the scenes.</p>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-soft)] hover:text-[var(--color-gold-dark)]"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* FAQ strip */}
      <div className="mt-16">
        <SectionHeading
          eyebrow="Quick answers"
          title="Frequently asked"
          description="Common questions — you may find your answer before you even hit send."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <h3 className="font-medium text-ink">{f.q}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Still stuck? Browse the{" "}
          <Link href="/products" className="font-medium text-[var(--color-gold-dark)] hover:underline">
            full collection
          </Link>{" "}
          or send us a message above.
        </p>
      </div>
    </Section>
  );
}
