import { Section } from "./Section";

export type PolicySection = { title: string; body: string };

export function PolicyPage({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow?: string;
  title: string;
  updated?: string;
  intro?: string;
  sections: PolicySection[];
}) {
  return (
    <Section className="max-w-3xl py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">{title}</h1>
      {updated && <p className="mt-3 text-sm text-ink-soft">Last updated: {updated}</p>}
      {intro && <p className="mt-6 leading-relaxed text-ink-soft">{intro}</p>}

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif text-xl text-ink">{s.title}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
