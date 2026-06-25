import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-7xl text-[var(--color-gold)]">404</p>
      <h1 className="mt-4 font-serif text-3xl tracking-tight">Page not found</h1>
      <p className="mt-3 text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/products" variant="outline">Browse products</ButtonLink>
      </div>
    </div>
  );
}
