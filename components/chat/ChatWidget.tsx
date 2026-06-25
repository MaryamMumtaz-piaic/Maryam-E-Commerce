"use client";

import { useEffect, useRef, useState } from "react";
import { ChatIcon, CloseIcon, SparkleIcon } from "@/components/ui/icons";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const firstName = userName?.split(" ")[0] ?? null;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: firstName
            ? `Hi ${firstName}! I'm Mira, your Maryam shopping assistant. How can I help you today?`
            : "Hi! I'm Mira, your Maryam shopping assistant. How can I help you today?",
        },
      ]);
    }
  }, [open, messages.length, firstName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Sorry, I didn't catch that." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-lg shadow-black/20 transition hover:scale-105"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-black/15">
          <div className="flex items-center gap-3 border-b border-line bg-surface-alt px-4 py-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-gold-soft)] text-[var(--color-gold-dark)]">
              <SparkleIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Mira</p>
              <p className="text-xs text-ink-soft">Shopping assistant</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm " +
                    (m.role === "user"
                      ? "bg-ink text-white"
                      : "bg-surface-alt text-ink")
                  }
                >
                  {renderWithLinks(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-surface-alt px-3.5 py-2.5">
                  <span className="flex gap-1">
                    <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="border-t border-line p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, shipping…"
                className="h-10 flex-1 rounded-full border border-line bg-surface-alt px-4 text-sm focus:border-[var(--color-gold)] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition hover:bg-black/85 disabled:opacity-50"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-ink-soft"
      style={{ animationDelay: delay }}
    />
  );
}

// Linkify internal paths like /products and discount codes.
function renderWithLinks(text: string) {
  const parts = text.split(/(\/[a-z0-9/-]+|SAVE10)/g);
  return parts.map((part, i) => {
    if (part === "SAVE10") {
      return (
        <span key={i} className="rounded bg-[var(--color-gold-soft)] px-1.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-gold-dark)]">
          {part}
        </span>
      );
    }
    if (/^\/[a-z0-9/-]+$/.test(part)) {
      return (
        <a key={i} href={part} className="font-medium text-[var(--color-gold-dark)] underline">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
