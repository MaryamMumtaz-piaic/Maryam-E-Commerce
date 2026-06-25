import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { isDbConfigured, prisma } from "@/lib/prisma";

type IncomingItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function POST(req: Request) {
  const session = await auth();
  const { items, email } = (await req.json()) as { items: IncomingItem[]; email?: string };

  if (!items?.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const customerEmail = email ?? session?.user?.email ?? undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Persist a pending order when a DB is configured.
  let orderId: string | null = null;
  if (isDbConfigured) {
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        email: customerEmail ?? "guest@maryam.shop",
        status: "PROCESSING",
        total,
        items: {
          create: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
    });
    orderId = order.id;
  }

  if (!isStripeConfigured) {
    // Stub mode: skip Stripe and go straight to a simulated success page.
    const url = `${siteUrl}/checkout/success?demo=1${orderId ? `&order=${orderId}` : ""}`;
    return NextResponse.json({ url, demo: true });
  }

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(i.price * 100),
        product_data: {
          name: i.name,
          images: i.image ? [i.image] : undefined,
        },
      },
    })),
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
    metadata: { orderId: orderId ?? "" },
  });

  if (orderId && isDbConfigured) {
    await prisma.order.update({
      where: { id: orderId },
      data: { stripeSessionId: checkout.id },
    });
  }

  return NextResponse.json({ url: checkout.url });
}
