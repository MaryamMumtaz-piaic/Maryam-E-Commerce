import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = { title: "Contact" };

const DETAILS = [
  { label: "Email", value: "hello@maryam.shop" },
  { label: "Phone", value: "+1 (555) 014-2200" },
  { label: "Studio", value: "24 Atelier Lane, Suite 5\nNew York, NY 10013" },
  { label: "Hours", value: "Mon–Fri, 9am–6pm EST" },
];

export default function ContactPage() {
  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact us"
        description="Questions about an order, a product, or a partnership? We'd love to hear from you."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
          <h2 className="font-serif text-xl">Store information</h2>
          {DETAILS.map((d) => (
            <div key={d.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{d.label}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink">{d.value}</p>
            </div>
          ))}
        </aside>
      </div>
    </Section>
  );
}
