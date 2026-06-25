import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";

const VALID = ["PROCESSING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, status } = await req.json();
  if (!orderId || !VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid order or status." }, { status: 400 });
  }

  if (!isDbConfigured) {
    return NextResponse.json({ ok: true, demo: true });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json({ ok: true });
}
