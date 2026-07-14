export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // rich markdown content
  category: string;
  date: string;
  image: string;
  author: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "how-to-build-a-capsule-wardrobe-that-lasts",
    title: "How to Build a Capsule Wardrobe That Lasts",
    excerpt: "Fewer, better pieces — the art of choosing garments that work together season after season.",
    category: "Style",
    date: "June 18, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&h=600&q=80",
    content: `Building a capsule wardrobe is not about restriction; it is about finding freedom in curation. When you choose fewer, better pieces, you simplify your morning routine and cultivate a clear, intentional style.

## 1. Define Your Palette
Start with a base of neutral colors: black, white, navy, or beige. These tones form the foundation because they seamlessly pair together. Add one or two accent colors that complement your skin tone and bring you joy.

## 2. Prioritize Quality Over Quantity
Look for natural fibers such as organic cotton, linen, silk, wool, and leather. These materials breathe better, feel more comfortable, and age with character, whereas synthetic fibers often wear down after a few washes.

## 3. Focus on Fit and Versatility
Every item in your capsule should serve at least three different outfits. A classic trench coat can transition from a casual weekend walk to a formal business dinner. Ensure fits are comfortable and tailored to your body.

*Invest in classics, wear them daily, and care for them well.*`
  },
  {
    slug: "the-quiet-luxury-of-everyday-objects",
    title: "The Quiet Luxury of Everyday Objects",
    excerpt: "Why the things we use daily deserve as much thought as the ones we save for special occasions.",
    category: "Home & Living",
    date: "June 10, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&h=600&q=80",
    content: `We often store our finest porcelain and delicate items for 'special occasions' that rarely arrive. But the items we interact with every day—our morning mug, our desk pen, or our entry keyholder—shape our daily state of mind.

## Elevating the Mundane
Quiet luxury is not about showing off wealth; it is about finding deep, tactile satisfaction in daily utility. A ceramic mug thrown by hand has a weight, texture, and warmth that standard mass-produced mugs cannot replicate.

## Craftsmanship That Speaks
When an object is made with care, that care is transmitted during use. A leather wallet that acquires a beautiful patina over the years becomes an extension of your own story. Choose objects that have been crafted with intent, and you will find your routines transformed into rituals.`
  },
  {
    slug: "a-skincare-routine-that-actually-works",
    title: "A Skincare Routine That Actually Works",
    excerpt: "Cut through the noise with a simple, effective routine built around a few honest products.",
    category: "Beauty",
    date: "June 2, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&h=600&q=80",
    content: `The beauty industry thrives on complexity, offering ten-step routines and endless novelty. However, dermatologists agree: consistency and simplicity are the keys to healthy, radiant skin.

## The Three Pillars of Skincare
You do not need a shelf full of serums. You need three basic steps:

1. **Cleanse**: A gentle, non-stripping cleanser to remove dirt and oils without disrupting your skin barrier.
2. **Moisturize**: A nourishing moisturizer to lock in hydration and protect the outer layers.
3. **Protect**: Broad-spectrum SPF (30 or higher) every single day, rain or shine.

## Adding Targeted Treatments
If you want to address specific concerns like hyperpigmentation or aging, introduce a single active ingredient (like Vitamin C in the morning or Retinol at night) slowly. Keep the foundation simple, and let your skin rest.`
  },
  {
    slug: "tech-that-fits-into-life-not-the-other-way-around",
    title: "Tech That Fits Into Life, Not the Other Way Around",
    excerpt: "The best gadgets disappear into your routine. Here's how to choose devices that serve you.",
    category: "Electronics",
    date: "May 24, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&h=600&q=80",
    content: `Technology should empower us, not distract us. Too often, we buy gadgets that demand our constant attention, notifications, and updates. The most premium technology is that which serves us and disappears into the background.

## The Principle of Frictionless Utility
When choosing new tech, ask yourself: *Does this solve an existing problem, or does it create a new chore?* Noise-cancelling headphones that pair instantly and have a long battery life reduce friction in your day. A smart device that requires constant troubleshooting adds friction.

## Minimalist Tech Design
Look for clean design and physical controls. Premium devices are built with honest materials like aluminum and glass, avoiding cheap plastics. Choose tools that respect your digital boundaries, letting you focus on the real world.`
  },
  {
    slug: "caring-for-leather-so-it-ages-beautifully",
    title: "Caring for Leather So It Ages Beautifully",
    excerpt: "A little maintenance goes a long way. Keep your bags and shoes looking their best for years.",
    category: "Accessories",
    date: "May 15, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&h=600&q=80",
    content: `Genuine leather is a living material. Unlike synthetic alternatives, it gets better with age, developing a unique character. However, this longevity depends on simple, regular care.

## 1. Clean Regularly
Wipe down your leather items with a soft, dry cloth after use. For deeper cleaning, use a damp cloth and mild, specialized leather soap. Never soak leather in water.

## 2. Condition periodically
Leather loses moisture over time, which can lead to cracking. Every few months, apply a high-quality leather conditioner using a circular motion. This keeps the fibers supple and rich.

## 3. Storage Matters
Store leather bags and shoes in a cool, dry place away from direct sunlight, which can fade and dry out the hide. Use dust bags and stuff shoes with cedar shoe trees to maintain their shape.`
  },
  {
    slug: "the-case-for-buying-less-choosing-well",
    title: "The Case for Buying Less, Choosing Well",
    excerpt: "Our founder on the philosophy that shapes every product we choose to stock.",
    category: "Journal",
    date: "May 6, 2026",
    author: "Maryam Mumtaz",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
    content: `In an era of ultra-fast fashion and cheap goods, choosing to buy less is a radical act of curation. At Maryam, we believe that every object in your home and closet should be a source of quiet utility and aesthetic pleasure.

## Curation Over Consumption
Buying less is not about self-deprivation. It is about elevating your standards. When we limit our purchases, we can afford to invest in items that are made with superior craftsmanship and materials.

## The Lifetime Cost
A cheap shirt that falls apart after three washes is far more expensive in the long run than a premium, well-made linen shirt that lasts for years. By choosing well, we reduce waste, support artisans who care about their work, and live in a space that feels calm, intentional, and beautiful.`
  }
];

export async function getBlogPosts() {
  return POSTS;
}

export async function getBlogPostBySlug(slug: string) {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
