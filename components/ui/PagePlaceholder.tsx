import { Section } from "./Section";
import { ButtonLink } from "./Button";

export function PagePlaceholder({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase?: string;
}) {
  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      {phase && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
          {phase}
        </p>
      )}
      <h1 className="font-serif text-4xl tracking-tight text-ink">{title}</h1>
      <p className="mt-4 max-w-md text-ink-soft">{description}</p>
      <div className="mt-8">
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </Section>
  );
}
