import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  return (
    <Section className="max-w-2xl py-12">
      <SectionHeading eyebrow="Account" title="Your profile" description="Manage your account details." />
      <ProfileForm
        initialName={session.user.name ?? ""}
        email={session.user.email ?? ""}
        role={session.user.role}
      />
    </Section>
  );
}
