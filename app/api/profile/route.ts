import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!isDbConfigured) {
    // Demo mode: nothing to persist, but report success so the UI flow works.
    return NextResponse.json({ ok: true, demo: true });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name: name || null },
  });

  return NextResponse.json({ ok: true });
}
