import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function CartIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L22 8H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17.5" cy="20" r="1.3" />
    </svg>
  );
}

export function HeartIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 20s-7-4.6-9.2-9A4.7 4.7 0 0 1 12 6.5 4.7 4.7 0 0 1 21.2 11C19 15.4 12 20 12 20z" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeft(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRight(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChatIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function ArrowRight(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    </svg>
  );
}

export function TruckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ChevronDown(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function EyeIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.9 4.6M6.6 6.6A17.7 17.7 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.4-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

// Google "G" in full brand colors — for the OAuth button.
export function GoogleIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function MailIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 5c0-1 .8-2 1.8-2h2.1c.5 0 .9.3 1 .8l.9 3.4c.1.4 0 .9-.4 1.2L7.9 10a13 13 0 0 0 6 6l1.6-1.6c.3-.3.8-.4 1.2-.3l3.4.9c.5.1.8.5.8 1v2.1c0 1-.9 1.9-2 1.8A16 16 0 0 1 4 5z" />
    </svg>
  );
}

export function MapPinIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

// ── Social icons (filled brand glyphs; use currentColor) ──────────────────────
const social = { viewBox: "0 0 24 24", fill: "currentColor" };

export function FacebookIcon(p: IconProps) {
  return (
    <svg {...social} {...p}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.48-4.1 4.2v2.34H7.7V13h2.74v8h3.06z" />
    </svg>
  );
}

export function InstagramIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(p: IconProps) {
  return (
    <svg {...social} {...p}>
      <path d="M17.5 3h3l-6.55 7.5L21.8 21h-5.9l-4.2-5.5L6.9 21H3.9l7-8-6.9-10h6l3.8 5.05L17.5 3zm-1 16h1.65L7.6 4.7H5.85L16.5 19z" />
    </svg>
  );
}

export function LinkedInIcon(p: IconProps) {
  return (
    <svg {...social} {...p}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11.3 22 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21h-4z" />
    </svg>
  );
}

export function YouTubeIcon(p: IconProps) {
  return (
    <svg {...social} {...p}>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.75-1.75C19.35 5.15 12 5.15 12 5.15s-7.35 0-8.85.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.75 1.75c1.5.4 8.85.4 8.85.4s7.35 0 8.85-.4a2.5 2.5 0 0 0 1.75-1.75C23 15.2 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

export function TikTokIcon(p: IconProps) {
  return (
    <svg {...social} {...p}>
      <path d="M16.5 3c.3 2.1 1.5 3.8 3.5 4.2v2.7c-1.3.13-2.5-.2-3.6-.85v5.6c0 3.2-2.4 5.35-5.3 5.35A5.15 5.15 0 0 1 5.9 14.9c0-2.9 2.5-5.2 5.55-4.9v2.85c-.35-.1-.7-.15-1-.15-1.35 0-2.4 1.1-2.4 2.3 0 1.35 1.05 2.35 2.4 2.35 1.35 0 2.45-1 2.45-2.6V3h3.1z" />
    </svg>
  );
}

// ── Payment marks (rounded chip badges, self-contained, no external assets) ───
function PayChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-11 items-center justify-center rounded-md border border-line bg-white text-[9px] font-bold tracking-tight text-ink-soft shadow-sm",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function VisaMark() {
  return <PayChip label="VISA" className="italic text-[#1a1f71]" />;
}
export function MastercardMark() {
  return <PayChip label="MC" className="text-[#eb001b]" />;
}
export function AmexMark() {
  return <PayChip label="AMEX" className="text-[#2e77bc]" />;
}
export function PaypalMark() {
  return <PayChip label="PayPal" className="text-[#003087]" />;
}
export function ApplePayMark() {
  return <PayChip label="Pay" className="text-ink" />;
}
export function GooglePayMark() {
  return <PayChip label="GPay" className="text-ink" />;
}
