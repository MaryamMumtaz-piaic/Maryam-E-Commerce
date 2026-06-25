import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { isDbConfigured, prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/auth-helpers";

// Demo fallback accounts used only when no database is configured, so auth is
// demoable out of the box. Real accounts live in Postgres.
const DEMO_USERS = [
  { id: "demo-admin", name: "Maryam Admin", email: "m.samiwaseem1234@gmail.com", password: "admin1234", role: "ADMIN" as const },
  { id: "demo-user", name: "Demo Customer", email: "customer@maryam.shop", password: "demo1234", role: "USER" as const },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        if (!isDbConfigured) {
          const u = DEMO_USERS.find((d) => d.email === email);
          if (!u || u.password !== password) return null;
          return { id: u.id, name: u.name, email: u.email, role: u.role };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        const role = user.role === "ADMIN" || isAdminEmail(email) ? "ADMIN" : "USER";
        return { id: user.id, name: user.name, email: user.email, role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
        token.uid = user.id;
      }
      // Promote configured admin emails even if DB role lags
      if (token.email && isAdminEmail(token.email)) token.role = "ADMIN";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? session.user.id;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
});
