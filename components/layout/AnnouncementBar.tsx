const MESSAGES = [
  "50% OFF on all products — buy today!",
  "Free shipping on every order",
  "Limited time Tech Week deals — save up to 40%",
  "New arrivals just dropped",
];

export function AnnouncementBar() {
  // Two identical tracks so the loop is seamless as it scrolls left → right.
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden bg-ink py-1.5">
      <div className="flex w-max animate-marquee-ltr whitespace-nowrap">
        {track.map((msg, i) => (
          <span
            key={i}
            className="mx-5 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60"
          >
            <span className="text-[var(--color-gold)]/80">✦</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
