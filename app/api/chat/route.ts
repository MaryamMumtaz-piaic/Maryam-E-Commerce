import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDbConfigured, prisma } from "@/lib/prisma";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Mira, the friendly shopping assistant for Maryam — a refined e-commerce store selling apparel, footwear, accessories, home goods, beauty, electronics, bags, and jewelry.

Guidelines:
- Be warm, concise, and helpful. Keep replies to 2-4 sentences.
- Help customers find products, navigate the site, and answer shopping questions.
- Site map: /products (shop all), /categories/<slug>, /cart, /wishlist, /checkout, /about, /contact.
- If a customer is hesitant or asks about deals, you may offer a one-time discount code by saying the exact phrase "Here's a code: SAVE10" (10% off) — but only do this once per conversation and only when it helps close a sale.
- Never invent order details or prices you don't know. Encourage browsing /products.`;

function discountReply(name: string | null): string {
  const greeting = name ? `${name}, ` : "";
  return `${greeting}I'd love to help you find something perfect! As a little welcome gift, here's a code: SAVE10 for 10% off your order. Browse our latest at /products — what are you shopping for today?`;
}

function stubReply(messages: ChatMessage[], name: string | null): string {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  const hi = name ? `Hi ${name}! ` : "Hi there! ";

  if (/discount|coupon|deal|cheap|sale|promo/.test(last)) {
    return discountReply(name);
  }
  if (/ship|delivery|deliver/.test(last)) {
    return `${hi}We offer free shipping on orders over $75, and standard delivery typically takes 3–5 business days.`;
  }
  if (/return|refund/.test(last)) {
    return `${hi}You can return unused items within 30 days for a full refund. See /legal for the full policy.`;
  }
  if (/recommend|suggest|gift|looking for|find/.test(last)) {
    return `${hi}Happy to help! Tell me a category — apparel, footwear, accessories, home, beauty, or jewelry — and I'll point you to /products with the best picks.`;
  }
  if (/track|order|status/.test(last)) {
    return `${hi}You can view your order status anytime under /orders once you're signed in.`;
  }
  return `${hi}I'm Mira, your Maryam shopping assistant. I can help you find products, check shipping, or apply a discount. Browse everything at /products — what can I help with?`;
}

export async function POST(req: Request) {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] ?? null;
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // Issue a discount code in the DB if the latest turn warrants it.
  const lastUser = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  const wantsDeal = /discount|coupon|deal|cheap|sale|promo/.test(lastUser);
  if (wantsDeal && isDbConfigured) {
    await prisma.discount
      .upsert({
        where: { code: "SAVE10" },
        update: {},
        create: { code: "SAVE10", percentOff: 10, reason: "Chatbot welcome offer" },
      })
      .catch(() => {});
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: stubReply(messages, userName), demo: true });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const personalized = userName
      ? `${SYSTEM_PROMPT}\n\nThe current customer's name is ${userName}. Greet them by name warmly.`
      : SYSTEM_PROMPT;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 220,
      messages: [
        { role: "system", content: personalized },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || stubReply(messages, userName);
    return NextResponse.json({ reply });
  } catch {
    // Fall back gracefully if the API call fails.
    return NextResponse.json({ reply: stubReply(messages, userName), fallback: true });
  }
}
