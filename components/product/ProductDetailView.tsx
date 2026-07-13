"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductView, ReviewView } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { ShieldIcon, TruckIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

// ── Icons ───────────────────────────────────────────────────────────────────

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ── Mock Initial Comments ───────────────────────────────────────────────────

type Comment = {
  id: string;
  author: string;
  avatar: string;
  body: string;
  likes: number;
  liked?: boolean;
  timestamp: string;
  replies?: Comment[];
};

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Elena Rostova",
    avatar: "ER",
    body: "Does the material have any stretch to it? Thinking of sizing down.",
    likes: 4,
    timestamp: "2 hours ago",
    replies: [
      {
        id: "c1-r1",
        author: "Marcus Vance",
        avatar: "MV",
        body: "It has very little stretch. I recommend staying true to your regular size!",
        likes: 2,
        timestamp: "1 hour ago",
      }
    ]
  },
  {
    id: "c2",
    author: "Siddharth Kumar",
    avatar: "SK",
    body: "Absolutely love the color finish in person. Exactly like the studio photos.",
    likes: 5,
    timestamp: "3 hours ago"
  }
];

const MOCK_NAMES = ["Sophie Dubois", "Lucas Meier", "Anna Kowalski", "Yuki Tanaka", "Liam Gallagher"];
const MOCK_REPLIES = [
  "Does it come in other colors?",
  "Perfect fit, fast delivery. Highly recommend!",
  "Is the material suitable for summer?",
  "Will this be restocked soon?",
  "Beautiful packaging and solid build quality."
];

// ── Main Component ──────────────────────────────────────────────────────────

export function ProductDetailView({
  product,
  initialReviews,
  relatedProducts,
}: {
  product: ProductView;
  initialReviews: ReviewView[];
  relatedProducts: ProductView[];
}) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));

  // State controls
  const [activeImg, setActiveImg] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping" | "reviews" | "faq">("desc");

  // Options state
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Beige");
  const [qty, setQty] = useState(1);
  const [loadingAction, setLoadingAction] = useState<"cart" | "buy" | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [compared, setCompared] = useState(false);

  // Social proof mock tickers
  const [viewers, setViewers] = useState(14);
  const [purchased, setPurchased] = useState(5);

  // Custom reviews
  const [reviews, setReviews] = useState<ReviewView[]>(initialReviews);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Tick viewers/purchases randomly
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(8, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Simulating live questions/comments arriving every 30s
  useEffect(() => {
    const t = setInterval(() => {
      const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
      const randomBody = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      const newLiveComment: Comment = {
        id: `live-${Date.now()}`,
        author: randomName,
        avatar: randomName.split(" ").map(w => w[0]).join(""),
        body: randomBody,
        likes: 0,
        timestamp: "Just now"
      };
      setComments((prev) => [newLiveComment, ...prev]);
    }, 35000);
    return () => clearInterval(t);
  }, []);

  // Zoom-on-hover handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Add to Cart workflow
  const handleAddToCart = () => {
    setLoadingAction("cart");
    setTimeout(() => {
      add(
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
          stock: product.stock,
        },
        qty
      );
      setLoadingAction(null);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2000);
    }, 800);
  };

  // Buy Now workflow
  const handleBuyNow = () => {
    setLoadingAction("buy");
    setTimeout(() => {
      add(
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
          stock: product.stock,
        },
        qty
      );
      setLoadingAction(null);
      window.location.href = "/cart";
    }, 600);
  };

  // Share functionality
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  // Submit custom review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBody.trim()) return;

    if (editingReviewId) {
      // Edit existing review
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReviewId
            ? { ...r, rating: reviewRating, title: reviewTitle || null, body: reviewBody }
            : r
        )
      );
      setEditingReviewId(null);
    } else {
      // Create new review
      const newReview: ReviewView = {
        id: `rev-${Date.now()}`,
        rating: reviewRating,
        title: reviewTitle || null,
        body: reviewBody,
        authorName: "You (Verified Buyer)",
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
    }

    setReviewTitle("");
    setReviewBody("");
  };

  // Edit review helper
  const startEditingReview = (rev: ReviewView) => {
    setEditingReviewId(rev.id);
    setReviewRating(rev.rating);
    setReviewTitle(rev.title || "");
    setReviewBody(rev.body);
    setActiveTab("reviews");
    const element = document.getElementById("review-form");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Submit comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: "You",
      avatar: "U",
      body: newCommentText.trim(),
      likes: 0,
      timestamp: "Just now"
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
  };

  // Submit reply
  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `rep-${Date.now()}`,
      author: "You",
      avatar: "U",
      body: replyText.trim(),
      likes: 0,
      timestamp: "Just now"
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        return c;
      })
    );

    setReplyText("");
    setReplyTarget(null);
  };

  // Like comment helper
  const toggleLikeComment = (id: string, isReply = false, parentId?: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (isReply && parentId && c.id === parentId) {
          return {
            ...c,
            replies: c.replies?.map((r) =>
              r.id === id ? { ...r, likes: r.liked ? r.likes - 1 : r.likes + 1, liked: !r.liked } : r
            )
          };
        } else if (!isReply && c.id === id) {
          return { ...c, likes: c.liked ? c.likes - 1 : c.likes + 1, liked: !c.liked };
        }
        return c;
      })
    );
  };

  // Determine category options styling
  const isClothing = ["Apparel", "Clothing", "Shirt", "Dress", "Hoodie", "Outerwear"].some(c =>
    product.categoryName.toLowerCase().includes(c.toLowerCase())
  );
  const isShoes = ["Shoe", "Footwear", "Sneaker", "Boot"].some(c =>
    product.categoryName.toLowerCase().includes(c.toLowerCase())
  );

  const discountPercent = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Toast Share Notification ── */}
      <div
        className={cn(
          "fixed right-5 top-20 z-50 rounded-xl bg-ink px-4 py-3 text-xs text-white shadow-xl transition-all duration-300",
          showShareToast ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
        )}
      >
        🔗 Link copied to clipboard!
      </div>

      <Section className="py-4 md:py-6">
        {/* ── Breadcrumbs ── */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <Link href="/" className="hover:text-[var(--color-gold-dark)]">Home</Link>
          <span className="text-line">/</span>
          <Link href="/products" className="hover:text-[var(--color-gold-dark)]">Shop</Link>
          <span className="text-line">/</span>
          <Link href={`/categories/${product.categorySlug}`} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold-soft)]/60 px-2 py-0.5 font-medium text-[var(--color-gold-dark)]">
            {product.categoryName}
          </Link>
          <span className="text-line">/</span>
          <span className="text-ink font-medium max-w-[200px] truncate">{product.name}</span>
        </nav>

        {/* ── Main Product Grid ── */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          
          {/* Left Column: Premium Gallery (Desktop Thumbnail Left) */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-5">
            {/* Desktop Left Side Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-row gap-3 overflow-x-auto sm:flex-col sm:overflow-y-auto sm:max-h-[500px] scrollbar-hide py-1 sm:w-20 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "relative aspect-square w-16 sm:w-20 overflow-hidden rounded-lg bg-surface-alt ring-2 transition-all duration-200 shrink-0",
                      i === activeImg ? "ring-[var(--color-gold)] scale-95" : "ring-transparent hover:ring-line"
                    )}
                    aria-label={`Select product image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Interactive Zoom Image */}
            <div className="relative flex-1">
              <div
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-alt cursor-zoom-in border border-line shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? "scale(2.2)" : "scale(1)"
                  }}
                  className="h-full w-full object-cover transition-transform duration-150 ease-out"
                />
                
                {/* Badges Overlay */}
                {discountPercent > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Info Block */}
          <div className="flex flex-col">
            {/* Header info */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-gold-dark)]">
                {product.categoryName} • Sold by Maryam Shop
              </p>
              <h1 className="mt-1.5 font-serif text-2xl tracking-tight text-ink sm:text-[2rem] leading-tight font-normal">
                {product.name}
              </h1>
              
              {/* Rating summary */}
              <div className="mt-2.5 flex items-center gap-2">
                <Rating value={product.rating} size="sm" />
                <span className="text-xs text-ink-soft">
                  <span className="font-semibold text-ink">{product.rating}</span> ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Prices */}
            <div className="mt-4 flex items-baseline gap-3 border-b border-line pb-4.5">
              <span className="text-2xl font-bold text-ink">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="text-sm text-ink-soft line-through">{formatPrice(product.compareAt)}</span>
                  <span className="text-xs font-semibold text-emerald-600">Save {formatPrice(product.compareAt - product.price)}</span>
                </>
              )}
            </div>

            {/* Description Short */}
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>

            {/* ── Product Variant Selectors ── */}
            <div className="mt-6 flex flex-col gap-4.5 border-t border-b border-line py-5">
              {isClothing && (
                <>
                  {/* Size selectors */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink uppercase tracking-wide">Size</span>
                      <span className="text-ink-soft underline cursor-pointer hover:text-ink">Size Guide</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={cn(
                            "min-w-10 h-8 rounded-md border text-[11px] font-semibold transition-all duration-200",
                            selectedSize === sz
                              ? "border-ink bg-ink text-white"
                              : "border-line text-ink-soft hover:border-ink hover:text-ink"
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color selectors */}
                  <div>
                    <span className="text-xs font-semibold text-ink uppercase tracking-wide block">Color</span>
                    <div className="mt-2 flex gap-2.5">
                      {[
                        { name: "Beige", hex: "#e5d3b3" },
                        { name: "Navy", hex: "#1e293b" },
                        { name: "Black", hex: "#0f172a" },
                        { name: "Gold", hex: "#c8a24b" },
                      ].map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col.name)}
                          className={cn(
                            "relative h-7 w-7 rounded-full border ring-offset-2 transition-all duration-200",
                            selectedColor === col.name ? "ring-1.5 ring-ink" : "border-line"
                          )}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isShoes && (
                <>
                  {/* Shoe size selectors */}
                  <div>
                    <span className="text-xs font-semibold text-ink uppercase tracking-wide block">Shoe Size</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["38", "39", "40", "41", "42", "43", "44", "45"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={cn(
                            "w-10 h-8 rounded-md border text-[11px] font-semibold transition-all duration-200",
                            selectedSize === sz
                              ? "border-ink bg-ink text-white"
                              : "border-line text-ink-soft hover:border-ink hover:text-ink"
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Material info */}
              <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span className="font-semibold text-ink">Material:</span>
                <span>Premium organic fibers / Sustainable fabric blend.</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold text-ink uppercase tracking-wide">Quantity</span>
              <div className="flex items-center rounded-lg border border-line">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-8 w-8 place-items-center text-sm text-ink hover:bg-surface-alt rounded-l-lg transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="grid h-8 w-8 place-items-center text-sm text-ink hover:bg-surface-alt rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] font-medium text-emerald-600">
                {product.stock > 0 ? `In Stock (${product.stock} units left)` : "Out of Stock"}
              </span>
            </div>

            {/* ── Conversion Actions ── */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex gap-2.5">
                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || loadingAction !== null}
                  className={cn(
                    "flex-1 flex h-11 items-center justify-center gap-2 rounded-full border border-ink text-xs font-semibold uppercase tracking-widest transition-all duration-200 active:scale-97",
                    addedMessage
                      ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-white"
                      : "bg-transparent text-ink hover:bg-surface-alt"
                  )}
                >
                  {loadingAction === "cart" ? (
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-1.5 border-ink border-t-transparent" />
                  ) : addedMessage ? (
                    "✓ Added"
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                {/* Buy Now button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || loadingAction !== null}
                  className="flex-1 flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all duration-200 hover:bg-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)] active:scale-97 disabled:bg-ink-soft/40 disabled:shadow-none"
                >
                  {loadingAction === "buy" ? (
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-1.5 border-white border-t-transparent" />
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>

              {/* Extra micro actions */}
              <div className="flex justify-between items-center px-1 text-xs text-ink-soft border-b border-line pb-4.5 mt-2">
                <button
                  type="button"
                  onClick={() => toggle({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] })}
                  className="flex items-center gap-1.5 hover:text-ink transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" className={cn("h-4 w-4", wished && "text-[var(--color-gold-dark)]")}>
                    <path d="M12 20s-7-4.6-9.2-9A4.7 4.7 0 0 1 12 6.5 4.7 4.7 0 0 1 21.2 11C19 15.4 12 20 12 20z" />
                  </svg>
                  <span>{wished ? "Wished" : "Wishlist"}</span>
                </button>

                <button type="button" onClick={handleShare} className="flex items-center gap-1.5 hover:text-ink transition-colors">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCompared(!compared)}
                  className="flex items-center gap-1.5 hover:text-ink transition-colors"
                >
                  <CompareIcon className={cn("h-4 w-4", compared && "text-[var(--color-gold-dark)]")} />
                  <span>{compared ? "Compared" : "Compare"}</span>
                </button>
              </div>
            </div>

            {/* ── Social Proof & Trust badges ── */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
                <span className="text-ink-soft">
                  <span className="font-semibold text-ink">{viewers} people</span> are viewing this item right now
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                <span className="text-ink-soft">
                  <span className="font-semibold text-ink">{purchased} orders</span> placed in the last 24 hours
                </span>
              </div>

              {/* Badges Strip */}
              <div className="mt-4.5 grid grid-cols-2 gap-3.5 rounded-xl border border-line bg-surface-alt/60 p-4">
                <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                  <TruckIcon className="h-5 w-5 shrink-0 text-[var(--color-gold-dark)]" />
                  <div>
                    <p className="font-semibold text-ink">Free Shipping</p>
                    <p className="text-[10px] mt-0.5 leading-none">On all orders over $75</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                  <ShieldIcon className="h-5 w-5 shrink-0 text-[var(--color-gold-dark)]" />
                  <div>
                    <p className="font-semibold text-ink">Secure Checkout</p>
                    <p className="text-[10px] mt-0.5 leading-none">Stripe SSL Encryption</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 shrink-0 text-[var(--color-gold-dark)]">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="font-semibold text-ink">30-Day Returns</p>
                    <p className="text-[10px] mt-0.5 leading-none">Easy, hassle-free policy</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 shrink-0 text-[var(--color-gold-dark)]">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <div>
                    <p className="font-semibold text-ink">100% Authentic</p>
                    <p className="text-[10px] mt-0.5 leading-none">Original Brand Guarantee</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-12 border-t border-line pt-6">
          {/* Headers */}
          <div className="flex border-b border-line overflow-x-auto gap-6 sm:gap-10 pb-px">
            {[
              { id: "desc", label: "Description" },
              { id: "specs", label: "Specifications" },
              { id: "shipping", label: "Shipping & Returns" },
              { id: "reviews", label: `Reviews (${reviews.length})` },
              { id: "faq", label: "FAQs" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "pb-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 border-b-2 outline-none relative shrink-0",
                  activeTab === t.id
                    ? "border-[var(--color-gold-dark)] text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body contents */}
          <div className="py-6 min-h-[220px]">
            {activeTab === "desc" && (
              <div className="max-w-3xl animate-fade-in">
                <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-line">{product.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div className="border-l-2 border-[var(--color-gold)] pl-3">
                    <p className="font-semibold text-ink">Premium Materials</p>
                    <p className="text-ink-soft mt-1 leading-normal">Carefully sourced fibers optimized for durability and touch sensation.</p>
                  </div>
                  <div className="border-l-2 border-[var(--color-gold)] pl-3">
                    <p className="font-semibold text-ink">Craftsmanship</p>
                    <p className="text-ink-soft mt-1 leading-normal">Handcrafted and structured details ensuring long-lasting style integrity.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl animate-fade-in">
                <table className="w-full text-xs text-ink-soft border-collapse">
                  <tbody>
                    <tr className="border-b border-line">
                      <td className="py-2.5 font-semibold text-ink uppercase tracking-wide w-1/3">Weight</td>
                      <td className="py-2.5">Lightweight / 0.45 kg</td>
                    </tr>
                    <tr className="border-b border-line">
                      <td className="py-2.5 font-semibold text-ink uppercase tracking-wide">Origin</td>
                      <td className="py-2.5">Designed in Milan, responsibly made in Turkey</td>
                    </tr>
                    <tr className="border-b border-line">
                      <td className="py-2.5 font-semibold text-ink uppercase tracking-wide">Dimensions</td>
                      <td className="py-2.5">Standard fit sizing</td>
                    </tr>
                    <tr className="border-b border-line">
                      <td className="py-2.5 font-semibold text-ink uppercase tracking-wide">Care Guide</td>
                      <td className="py-2.5">Dry clean recommended or machine wash cold on delicate cycle.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-3xl flex flex-col gap-4 animate-fade-in">
                <div className="text-xs text-ink-soft">
                  <p className="font-semibold text-ink uppercase tracking-wide mb-1">Standard Delivery</p>
                  <p>Complimentary on orders above $75. Arrives within 3-5 business days.</p>
                </div>
                <div className="text-xs text-ink-soft border-t border-line pt-3">
                  <p className="font-semibold text-ink uppercase tracking-wide mb-1">Express Delivery</p>
                  <p>Flat rate of $15. Arrives within 1-2 business days with tracking.</p>
                </div>
                <div className="text-xs text-ink-soft border-t border-line pt-3">
                  <p className="font-semibold text-ink uppercase tracking-wide mb-1">Return Policy</p>
                  <p>We offer hassle-free returns within 30 days of shipment receipt. Return shipping label is generated on request.</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid gap-10 lg:grid-cols-2 animate-fade-in">
                {/* Left: list of reviews */}
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-ink">Customer reviews</span>
                    <span className="text-xs text-ink-soft">{reviews.length} total reviews</span>
                  </div>
                  {reviews.length === 0 ? (
                    <p className="text-xs text-ink-soft">No reviews yet. Be the first to share your thoughts.</p>
                  ) : (
                    <ul className="flex flex-col divide-y divide-line">
                      {reviews.map((r) => (
                        <li key={r.id} className="py-4.5 first:pt-0">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-gold-soft)] text-xs font-semibold text-[var(--color-gold-dark)]">
                                {r.authorName.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <p className="text-xs font-semibold text-ink">{r.authorName}</p>
                                <p className="text-[10px] text-ink-soft">{new Date(r.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Rating value={r.rating} size="sm" />
                          </div>
                          {r.title && <p className="mt-2 text-xs font-semibold text-ink">{r.title}</p>}
                          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{r.body}</p>
                          
                          {/* If review is custom, allow mock editing */}
                          {r.authorName.includes("You") && (
                            <button
                              type="button"
                              onClick={() => startEditingReview(r)}
                              className="mt-2 text-[10px] font-semibold text-[var(--color-gold-dark)] hover:underline"
                            >
                              Edit review
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Right: Submit Review Form */}
                <div id="review-form">
                  <form onSubmit={handleReviewSubmit} className="rounded-xl border border-line bg-surface-alt/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink">
                      {editingReviewId ? "Edit your review" : "Write a review"}
                    </p>

                    <div className="mt-3 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          onMouseEnter={() => setReviewHoverRating(n)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          aria-label={`${n} stars`}
                          className="p-0.5"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className={cn(
                              "h-5 w-5 transition-colors",
                              (reviewHoverRating || reviewRating) >= n ? "text-[var(--color-gold)]" : "text-line"
                            )}
                            fill="currentColor"
                          >
                            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    <input
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Review title (optional)"
                      className="mt-3.5 h-9 w-full rounded-lg border border-line bg-white px-3 text-xs focus:border-[var(--color-gold)] focus:outline-none"
                    />
                    <textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Share your experience with this item..."
                      required
                      rows={4}
                      className="mt-2.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-xs focus:border-[var(--color-gold)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="mt-3.5 inline-flex h-9 items-center justify-center rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black"
                    >
                      {editingReviewId ? "Save Changes" : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="max-w-2xl flex flex-col gap-4.5 animate-fade-in">
                <div className="text-xs">
                  <p className="font-semibold text-ink">Is this product authentic?</p>
                  <p className="text-ink-soft mt-1">Yes, all products sold by Maryam Shop are 100% authentic and backed by our authentic brand guarantee.</p>
                </div>
                <div className="text-xs border-t border-line pt-3.5">
                  <p className="font-semibold text-ink">How do I process a return?</p>
                  <p className="text-ink-soft mt-1">Simply contact our concierge service or access your account profile setting panel to download your return label within 30 days of delivery.</p>
                </div>
                <div className="text-xs border-t border-line pt-3.5">
                  <p className="font-semibold text-ink">What is the estimated shipping time?</p>
                  <p className="text-ink-soft mt-1">Orders are packed within 24 hours. Standard delivery reaches most regions in 3 to 5 business days.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Real-Time Comments Discussion ── */}
        <div className="mt-8 border-t border-line pt-8">
          <div className="max-w-3xl">
            <h3 className="font-serif text-lg text-ink font-normal">Live Community Discussion</h3>
            <p className="text-xs text-ink-soft mt-0.5">Connected to live storefront server. Post questions or share styling tips.</p>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Ask a question or comment on this item..."
                  rows={2}
                  className="w-full rounded-xl border border-line bg-surface-alt px-3 py-2 text-xs focus:border-[var(--color-gold)] focus:bg-white focus:outline-none"
                />
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-ink px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="mt-6 flex flex-col gap-5">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 text-xs">
                  {/* User initials avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-soft)] text-xs font-bold text-[var(--color-gold-dark)]">
                    {c.avatar}
                  </div>

                  <div className="flex-1">
                    {/* Header info */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{c.author}</span>
                      <span className="text-[10px] text-ink-soft">{c.timestamp}</span>
                    </div>

                    {/* Content */}
                    <p className="mt-1 text-ink-soft leading-relaxed">{c.body}</p>

                    {/* Interactions footer */}
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] font-semibold text-ink-soft">
                      <button
                        type="button"
                        onClick={() => toggleLikeComment(c.id)}
                        className={cn("hover:text-ink transition-colors", c.liked && "text-[var(--color-gold-dark)]")}
                      >
                        Like ({c.likes})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyTarget(replyTarget === c.id ? null : c.id)}
                        className="hover:text-ink transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-3.5 flex flex-col gap-4 border-l-2 border-line pl-3">
                        {c.replies.map((r) => (
                          <div key={r.id} className="flex gap-2">
                            <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[10px] font-bold text-ink">
                              {r.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-ink">{r.author}</span>
                                <span className="text-[9px] text-ink-soft">{r.timestamp}</span>
                              </div>
                              <p className="mt-1 text-ink-soft">{r.body}</p>
                              <div className="mt-1">
                                <button
                                  type="button"
                                  onClick={() => toggleLikeComment(r.id, true, c.id)}
                                  className={cn("text-[9px] font-semibold text-ink-soft hover:text-ink", r.liked && "text-[var(--color-gold-dark)]")}
                                >
                                  Like ({r.likes})
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Active Reply box */}
                    {replyTarget === c.id && (
                      <form onSubmit={(e) => handleReplySubmit(e, c.id)} className="mt-3 flex gap-2">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 h-8 rounded-lg border border-line px-3 text-xs focus:border-[var(--color-gold)] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-ink px-3 text-xs font-semibold text-white transition hover:bg-black"
                        >
                          Send
                        </button>
                      </form>
                    )}

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </Section>

      {/* ── Recommended Products: Carousels ── */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-line bg-surface-alt/30 py-10 mt-10">
          <Section>
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="font-serif text-xl text-ink font-normal">Related Products</h3>
              <span className="text-xs text-[var(--color-gold-dark)] hover:underline font-semibold cursor-pointer">View Collection</span>
            </div>

            {/* Carousel / Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedProducts.map((p) => {
                const innerSale = p.compareAt && p.compareAt > p.price;
                return (
                  <div key={p.id} className="group relative flex flex-col bg-white p-2.5 rounded-xl border border-line/60 hover:shadow-md transition duration-200">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-alt">
                      <Link href={`/products/${p.slug}`}>
                        <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-cover transition duration-300 group-hover:scale-105" />
                      </Link>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">{p.categoryName}</p>
                      <Link href={`/products/${p.slug}`} className="mt-1 block truncate text-xs font-semibold text-ink hover:text-[var(--color-gold-dark)]">
                        {p.name}
                      </Link>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-xs font-bold text-ink">{formatPrice(p.price)}</span>
                        {innerSale && (
                          <span className="text-[10px] text-ink-soft line-through">{formatPrice(p.compareAt!)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── Sticky Purchase actions on Mobile ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md flex gap-2.5 sm:hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 flex h-11 items-center justify-center rounded-full border border-ink text-xs font-semibold uppercase tracking-widest text-ink transition active:scale-97"
        >
          {addedMessage ? "✓ Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="flex-1 flex h-11 items-center justify-center rounded-full bg-ink text-xs font-semibold uppercase tracking-widest text-white shadow-md transition active:scale-97"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
