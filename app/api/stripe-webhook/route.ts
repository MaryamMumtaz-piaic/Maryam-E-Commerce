import { NextResponse } from "next/server";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { isDbConfigured, prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ received: true, demo: true });
  }

  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();

  let event;
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, secret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionObj = event.data.object as { id: string; metadata?: { orderId?: string } };
    if (isDbConfigured) {
      const orderId = sessionObj.metadata?.orderId;
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        }).catch(() => {});
      } else {
        await prisma.order.updateMany({
          where: { stripeSessionId: sessionObj.id },
          data: { status: "PAID" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
