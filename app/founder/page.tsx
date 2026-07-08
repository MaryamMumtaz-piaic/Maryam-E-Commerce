import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, SparkleIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

export const metadata = { title: "Founder" };

const PRINCIPLES = [
  { icon: SparkleIcon, title: "Intelligent by design", text: "Systems that reduce manual work and let people focus on what matters." },
  { icon: ShieldIcon, title: "Quality without compromise", text: "Every product and every line of code is built to last and to feel considered." },
  { icon: TruckIcon, title: "Empower & connect", text: "Technology should give people knowledge, opportunity, and genuine connection." },
];

export default function FounderPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-80 w-full overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&h=1080&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
              Meet the Founder
            </p>
            <h1 className="max-w-2xl font-serif text-4xl text-white sm:text-5xl">Maryam Mumtaz</h1>
            <p className="mt-2 text-white/75">Founder · Full-Stack Developer & AI Engineer</p>
          </div>
        </div>
      </section>

      <Section className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-serif text-3xl tracking-tight">A word from Maryam</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              I started Maryam Shop with a simple belief: technology and commerce should feel
              effortless, human, and beautiful. As a full-stack developer and AI engineer, I&apos;ve
              spent years building intelligent systems that reduce friction and empower the people
              who use them — and this store is where that philosophy meets everyday life.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Every detail here — from the curated catalog to the way the site responds under your
              fingertips — is engineered with intention. My mission is to build experiences that
              empower teams, reduce manual overhead, and turn thoughtful ideas into intelligent,
              automated reality.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Thank you for being here. Whether you&apos;re shopping, browsing, or simply exploring
              what&apos;s possible, I hope you feel the care that went into every corner of it.
            </p>
            <div className="mt-8">
              <ButtonLink href="/products" variant="gold" size="lg">
                Explore the collection <ArrowRight className="h-4.5 w-4.5" />
              </ButtonLink>
            </div>
          </div>

          <aside className="flex h-fit flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
            <h3 className="font-serif text-xl">At a glance</h3>
            <Detail label="Role" value="Founder, Marsa Empower" />
            <Detail label="Focus" value="Agentic AI · Full-Stack Development · Automation" />
            <Detail label="Based in" value="Karachi, Sindh, Pakistan" />
            <Detail label="Mission" value="Engineering intelligence into every system, one line of code at a time." />
          </aside>
        </div>
      </Section>

      <Section className="py-10">
        <SectionHeading eyebrow="What drives the work" title="Principles behind Maryam Shop" align="center" />
        <div className="grid gap-5 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-[var(--radius-card)] border border-line p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  );
}
