import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
  }

  const { productId, rating, title, body } = await req.json();
  const r = Number(rating);
  if (!productId || !body || r < 1 || r > 5) {
    return NextResponse.json({ error: "Please provide a rating (1-5) and a comment." }, { status: 400 });
  }

  if (!isDbConfigured) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message: "Review submitted (demo mode — connect a database to persist).",
    });
  }

  await prisma.review.upsert({
    where: { productId_userId: { productId, userId: session.user.id } },
    update: { rating: r, title: title || null, body },
    create: { productId, userId: session.user.id, rating: r, title: title || null, body },
  });

  // Recompute aggregate rating
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: productId },
    data: { rating: agg._avg.rating ?? 0, numReviews: agg._count },
  });

  return NextResponse.json({ ok: true });
}
