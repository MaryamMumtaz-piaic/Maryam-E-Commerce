import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, SparkleIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

export const metadata = { title: "Careers" };

const PERKS = [
  { icon: SparkleIcon, title: "Meaningful work", text: "Build products used by thousands, with real ownership over what you ship." },
  { icon: ShieldIcon, title: "Growth & learning", text: "A generous learning budget and mentorship to help you level up fast." },
  { icon: TruckIcon, title: "Flexible & remote", text: "Work from anywhere, with hours that fit your life." },
];

const ROLES = [
  { title: "Senior Frontend Engineer", type: "Full-time · Remote", team: "Engineering" },
  { title: "Product Designer", type: "Full-time · Remote", team: "Design" },
  { title: "Customer Experience Specialist", type: "Full-time · Hybrid", team: "Support" },
  { title: "Digital Marketing Lead", type: "Full-time · Remote", team: "Growth" },
];

export default function CareersPage() {
  return (
    <>
      <Section className="py-12">
        <SectionHeading
          eyebrow="Join the team"
          title="Careers at Maryam"
          description="We're a small team building thoughtful commerce experiences. If you care about craft, quality, and customers, we'd love to meet you."
        />

        <div className="grid gap-5 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-[var(--radius-card)] border border-line p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <h2 className="mb-6 font-serif text-2xl tracking-tight">Open positions</h2>
        <div className="flex flex-col gap-3">
          {ROLES.map((r) => (
            <div
              key={r.title}
              className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5 transition-all duration-300 hover:border-[var(--color-gold)] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-serif text-lg text-ink">{r.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {r.team} · {r.type}
                </p>
              </div>
              <ButtonLink href="/contact" variant="outline" size="sm" className="self-start sm:self-auto">
                Apply <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[var(--radius-card)] bg-ink px-8 py-12 text-center">
          <h2 className="mx-auto max-w-xl font-serif text-2xl text-white">
            Don&apos;t see the right role?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/75">
            We&apos;re always keen to hear from talented people. Send us a note and tell us how you&apos;d
            like to contribute.
          </p>
          <div className="mt-6">
            <ButtonLink href="/contact" variant="gold" size="lg">
              Get in touch <ArrowRight className="h-4.5 w-4.5" />
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
