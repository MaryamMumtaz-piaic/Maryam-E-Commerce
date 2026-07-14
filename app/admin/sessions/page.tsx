import { getActiveSessions } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sessions",
  description: "Monitor active customer sessions and system logins in real-time.",
  openGraph: {
    title: "Admin Sessions",
    description: "Monitor active customer sessions and system logins in real-time.",
  },
  twitter: {
    title: "Admin Sessions",
    description: "Monitor active customer sessions and system logins in real-time.",
  },
};

export default async function AdminSessionsPage() {
  const sessions = await getActiveSessions();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl tracking-tight">Active Sessions</h1>
      <p className="mb-8 text-sm text-ink-soft">
        {isDbConfigured
          ? "Recently active users on the platform."
          : "Demo session data — connect a database for live activity."}
      </p>

      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sessions.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-gold-soft)] text-xs font-semibold text-[var(--color-gold-dark)]">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> online
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={s.role === "ADMIN" ? "font-medium text-[var(--color-gold-dark)]" : "text-ink-soft"}>
                    {s.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(s.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
