import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isDbConfigured, prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email and a password of at least 6 characters are required." },
        { status: 400 },
      );
    }

    if (!isDbConfigured) {
      // No DB: accept the registration for demo purposes (not persisted).
      return NextResponse.json({
        ok: true,
        demo: true,
        message: "Account created (demo mode — not persisted). You can sign in with the demo accounts.",
      });
    }

    const normalized = String(email).toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: name || null,
        email: normalized,
        password: hashed,
        role: isAdminEmail(normalized) ? "ADMIN" : "USER",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
