"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { CartIcon } from "@/components/ui/icons";

// ── SVG Icons ────────────────────────────────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function NewChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 3h5v5M8 21H3v-5M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M21 3L14.5 9.5M3 21l6.5-6.5" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M12 2v9M3 11h18M7.5 7.5a2.5 2.5 0 0 1 0-5C10 2.5 12 7.5 12 7.5s-2 5-4.5 5a2.5 2.5 0 0 1 0-5Z" />
      <path d="M16.5 7.5a2.5 2.5 0 0 0 0-5C14 2.5 12 7.5 12 7.5s2 5 4.5 5a2.5 2.5 0 0 0 0-5Z" />
    </svg>
  );
}

function TrackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

// ── Matchable Catalog Products for Rich Cards ───────────────────────────────

type CatalogProduct = {
  name: string;
  slug: string;
  price: number;
  rating: number;
  image: string;
  category: string;
};

const RECOMMENDED_CATALOG: CatalogProduct[] = [
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    price: 149.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    price: 129.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
  },
  {
    name: "Modern Wooden Dining Table",
    slug: "modern-wooden-dining-table",
    price: 699.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=400&q=80",
    category: "Home & Living",
  },
  {
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    price: 259.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=400&q=80",
    category: "Home & Living",
  },
  {
    name: "Premium Leather Backpack",
    slug: "premium-leather-backpack",
    price: 189.00,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    category: "Accessories",
  }
];

// ── Types ───────────────────────────────────────────────────────────────────

type Msg = { role: "user" | "assistant"; content: string; key?: string };

// ── Custom Markdown Parser Helpers ──────────────────────────────────────────

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\)|SAVE10|\/[a-z0-9/-]+)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={idx} className="font-semibold text-ink">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={idx} className="italic text-ink-soft">{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("[") && token.includes("](")) {
      const match = token.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a key={idx} href={match[2]} className="text-[var(--color-gold-dark)] underline font-medium hover:text-[var(--color-gold)] transition-colors">
            {match[1]}
          </a>
        );
      }
    }
    if (token === "SAVE10") {
      return (
        <span key={idx} className="rounded bg-[var(--color-gold-soft)] px-1.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-gold-dark)]">
          {token}
        </span>
      );
    }
    if (/^\/[a-z0-9/-]+$/.test(token)) {
      return (
        <a key={idx} href={token} className="text-[var(--color-gold-dark)] underline font-medium hover:text-[var(--color-gold)] transition-colors">
          {token}
        </a>
      );
    }
    return token;
  });
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  let inList = false;
  let inCode = false;
  let listItems: string[] = [];
  const renderedElements: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 my-1.5 space-y-0.5">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-ink-soft">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushList(index);
      inCode = !inCode;
      return;
    }

    if (inCode) {
      renderedElements.push(
        <pre key={index} className="bg-surface-alt p-2.5 rounded-lg text-xs font-mono my-1.5 overflow-x-auto border border-line text-ink-soft">
          <code>{line}</code>
        </pre>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(index);
      renderedElements.push(
        <h1 key={index} className="font-serif text-base font-bold text-ink mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="font-serif text-sm font-semibold text-ink mt-2 mb-1">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="font-serif text-xs font-semibold text-ink mt-1.5 mb-0.5">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h3>
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(trimmed.substring(2));
    } else if (trimmed.startsWith("|")) {
      flushList(index);
      const cells = trimmed.split("|").map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
      if (cells.length > 0 && !trimmed.includes("---")) {
        renderedElements.push(
          <div key={index} className="flex border-b border-line py-1 text-xs text-ink-soft">
            {cells.map((cell, idx) => (
              <span key={idx} className="flex-1 font-medium">{parseInlineMarkdown(cell)}</span>
            ))}
          </div>
        );
      }
    } else if (trimmed === "") {
      flushList(index);
    } else {
      flushList(index);
      renderedElements.push(
        <p key={index} className="text-xs sm:text-sm leading-relaxed text-ink-soft mb-1.5">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList("final");

  return <div className="space-y-0.5">{renderedElements}</div>;
}

// ── Rich Product Card Component inside Chat ─────────────────────────────────

function RichProductCard({ product }: { product: CatalogProduct }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({
      id: product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: 10,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-2.5 flex flex-col gap-2 rounded-xl border border-line bg-white p-2.5 shadow-sm transition hover:shadow-md duration-200">
      <div className="flex gap-2.5">
        <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg bg-surface-alt border border-line">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="truncate text-xs font-semibold text-ink leading-tight">{product.name}</p>
          <span className="text-[9px] uppercase tracking-wide text-ink-soft mt-0.5">{product.category}</span>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs font-bold text-ink leading-none">{formatPrice(product.price)}</span>
            <span className="text-[10px] text-ink-soft leading-none">★ {product.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        <Link
          href={`/products/${product.slug}`}
          className="flex h-7.5 flex-1 items-center justify-center rounded-lg border border-line text-[10px] font-semibold uppercase tracking-wider text-ink hover:bg-surface-alt transition"
        >
          Quick View
        </Link>
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "flex h-7.5 flex-1 items-center justify-center gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white transition",
            added ? "bg-[var(--color-gold)]" : "bg-ink hover:bg-black"
          )}
        >
          <CartIcon className="h-3.5 w-3.5" />
          <span>{added ? "Added" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}

// ── Main ChatWidget ──────────────────────────────────────────────────────────

export function ChatWidget({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const firstName = userName?.split(" ")[0] ?? null;

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Simulated word-by-word streaming
  const streamTokens = (fullText: string) => {
    setLoading(false);
    const words = fullText.split(" ");
    let currentText = "";
    let wordIdx = 0;

    // Append blank assistant response container
    setMessages((prev) => [...prev, { role: "assistant", content: "", key: `stream-${Date.now()}` }]);

    const interval = setInterval(() => {
      if (wordIdx < words.length) {
        currentText += (wordIdx === 0 ? "" : " ") + words[wordIdx];
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: currentText,
            key: next[next.length - 1].key
          };
          return next;
        });
        wordIdx++;
      } else {
        clearInterval(interval);
      }
    }, 35);
  };

  // Submit flow
  async function sendQuery(queryText: string) {
    if (!queryText.trim() || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: queryText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const data = await res.json();
      const replyText = data.reply ?? "I'm sorry, I could not process your query.";
      streamTokens(replyText);
    } catch {
      streamTokens("I'm having trouble connecting right now. Please check your internet connection.");
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  // Check if assistant reply contains references to catalog products
  const getMatchedProduct = (content: string): CatalogProduct | null => {
    const text = content.toLowerCase();
    for (const prod of RECOMMENDED_CATALOG) {
      if (text.includes(prod.name.toLowerCase()) || text.includes(prod.slug.replace(/-/g, " "))) {
        return prod;
      }
    }
    return null;
  };

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Mira AI"
          className="fixed bottom-5 right-5 z-[80] group flex h-13 w-13 items-center justify-center rounded-full border border-line/60 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(200,162,75,0.18)] active:scale-95 animate-fade-in"
        >
          {/* Subtle Outer Glow Accent */}
          <span className="absolute inset-0 rounded-full border border-[var(--color-gold)]/25 group-hover:scale-110 transition duration-300 pointer-events-none" />
          
          <SparkleIcon className="h-5.5 w-5.5 text-ink-soft transition-colors duration-200 group-hover:text-[var(--color-gold-dark)]" />
          
          {/* Status Indicator */}
          <span className="absolute right-0.5 top-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* ── Slide-in Companion AI Panel ── */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[90] flex w-full max-w-[380px] sm:w-[380px] flex-col bg-white shadow-[-8px_0_35px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out border-l border-line",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-line px-4.5 py-3.5 bg-surface-alt/45">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)] relative shadow-sm border border-[var(--color-gold)]/10">
              <SparkleIcon className="h-4 w-4" />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 border border-white" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-ink leading-tight">Mira</h2>
              <span className="text-[10px] text-ink-soft leading-none mt-0.5 block">AI Shopping Assistant</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* New Chat */}
            <button
              type="button"
              onClick={() => setMessages([])}
              title="New chat"
              className="grid h-7.5 w-7.5 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-alt hover:text-ink"
            >
              <NewChatIcon className="h-4 w-4" />
            </button>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              title="Minimize chat"
              className="grid h-7.5 w-7.5 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-alt hover:text-ink"
            >
              <MinimizeIcon className="h-4 w-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              className="grid h-7.5 w-7.5 place-items-center rounded-lg text-ink hover:bg-surface-alt"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Panel Content (Scroll Area) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4.5 py-5 space-y-4 bg-white scrollbar-hide">
          
          {/* Welcome Screen / Empty State */}
          {messages.length === 0 ? (
            <div className="flex flex-col py-2 animate-fade-in">
              <div className="mb-4">
                <span className="text-lg">👋</span>
                <h3 className="mt-1 font-serif text-lg font-normal text-ink">
                  Welcome to Mira
                </h3>
                <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                  I can help you find products, compare items, discover new arrivals, track orders, or recommend gifts.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="mt-4 w-full flex flex-col gap-2.5">
                {[
                  { text: "Find Trending Products", desc: "Discover what's hot right now", q: "Show me the top trending products.", icon: <SearchIcon className="h-4.5 w-4.5" /> },
                  { text: "Compare Two Products", desc: "Decide between items easily", q: "Help me compare two fitness or audio products.", icon: <CompareIcon className="h-4.5 w-4.5" /> },
                  { text: "Gift Recommendations", desc: "Find the perfect gift option", q: "Give me some premium gift recommendations.", icon: <GiftIcon className="h-4.5 w-4.5" /> },
                  { text: "Track My Order", desc: "Check order shipping status", q: "How do I track my active orders?", icon: <TrackIcon className="h-4.5 w-4.5" /> },
                ].map((card) => (
                  <button
                    key={card.text}
                    type="button"
                    onClick={() => sendQuery(card.q)}
                    className="group flex items-start gap-3 rounded-xl border border-line bg-surface-alt/40 px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:translate-y-0"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white border border-line text-ink-soft transition duration-200 group-hover:border-[var(--color-gold)]/40 group-hover:text-[var(--color-gold-dark)] shadow-sm">
                      {card.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink leading-tight">{card.text}</p>
                      <p className="text-[10px] text-ink-soft leading-none mt-1">{card.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages thread
            <div className="space-y-4">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const matchedProduct = !isUser ? getMatchedProduct(m.content) : null;

                return (
                  <div key={m.key || i} className={cn("flex gap-2.5 text-xs sm:text-sm animate-fade-in", isUser ? "justify-end" : "justify-start")}>
                    
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/10 shadow-sm">
                        <SparkleIcon className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <div className={cn("flex flex-col gap-0.5 max-w-[84%]", isUser && "items-end")}>
                      <span className="text-[8.5px] font-semibold text-ink-soft uppercase tracking-wider">
                        {isUser ? "You" : "Mira"}
                      </span>
                      
                      <div
                        className={cn(
                          "px-3.5 py-2.5 leading-relaxed text-xs sm:text-sm shadow-[0_1px_2px_rgba(0,0,0,0.01)]",
                          isUser
                            ? "bg-ink text-white font-medium rounded-2xl rounded-tr-sm"
                            : "bg-surface-alt border border-line text-ink rounded-2xl rounded-tl-sm"
                        )}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-line text-xs sm:text-sm">{m.content}</p>
                        ) : (
                          <MarkdownMessage content={m.content} />
                        )}
                      </div>

                      {/* Display Rich Product Card if matched */}
                      {matchedProduct && <RichProductCard product={matchedProduct} />}
                    </div>
                  </div>
                );
              })}

              {/* Thinking State Loader */}
              {loading && (
                <div className="flex gap-2.5 text-xs sm:text-sm justify-start">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/10 animate-pulse">
                    <SparkleIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-[8.5px] font-semibold text-ink-soft uppercase tracking-wider">Mira</span>
                    <div className="rounded-2xl rounded-tl-sm border border-line bg-surface-alt px-3.5 py-2.5 flex items-center gap-2 shadow-sm">
                      <span className="text-xs font-semibold text-ink-soft animate-pulse">Mira is thinking</span>
                      <span className="flex gap-0.5 items-center pt-1.5">
                        <span className="h-1 w-1 rounded-full bg-ink-soft animate-bounce" style={{ animationDelay: "0s" }} />
                        <span className="h-1 w-1 rounded-full bg-ink-soft animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <span className="h-1 w-1 rounded-full bg-ink-soft animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel Footer (Input Box) */}
        <div className="border-t border-line bg-white p-3.5">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            {/* Custom Input Container with AI icon, attachment, voice future hooks */}
            <div className="relative w-full shadow-sm rounded-2xl border border-line bg-surface-alt focus-within:border-[var(--color-gold)]/60 focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--color-gold)]/5 transition-all duration-200">
              
              {/* Future Hook: Attachment */}
              <button
                type="button"
                title="Attach image (future feature)"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-ink-soft hover:bg-surface-alt hover:text-ink transition"
              >
                <PaperclipIcon className="h-4 w-4" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask Mira about products, orders, styles..."
                className="h-10 w-full bg-transparent pl-10 pr-20 text-xs text-ink placeholder:text-ink-soft focus:outline-none disabled:opacity-60"
              />

              {/* Action Buttons Row */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                {/* Future Hook: Voice Input */}
                <button
                  type="button"
                  title="Voice input (future feature)"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft hover:bg-surface-alt hover:text-ink transition"
                >
                  <MicIcon className="h-4 w-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-7.5 w-7.5 place-items-center rounded-lg bg-ink text-white transition-all duration-200 hover:bg-black hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:pointer-events-none"
                  aria-label="Send query"
                >
                  <SendIcon className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* ── Overlay Backdrop for closing panel ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[85] bg-black/5 backdrop-blur-[0.5px] transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
}
