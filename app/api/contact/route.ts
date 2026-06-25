import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (isDbConfigured) {
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message },
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks for reaching out — we'll get back to you within 1–2 business days.",
  });
}
