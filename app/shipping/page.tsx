import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Read about our delivery options, processing times, and free shipping rates.",
  openGraph: {
    title: "Shipping Information",
    description: "Read about our delivery options, processing times, and free shipping rates.",
  },
  twitter: {
    title: "Shipping Information",
    description: "Read about our delivery options, processing times, and free shipping rates.",
  },
};

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Customer Support"
      title="Shipping Information"
      updated="June 24, 2026"
      intro="We want your order to reach you quickly and safely. Here's everything you need to know about how, when, and where we ship."
      sections={[
        {
          title: "Processing Times",
          body: "Orders are processed within 1–2 business days after payment is confirmed. Orders placed on weekends or public holidays begin processing the next business day. You'll receive a confirmation email with tracking details as soon as your parcel ships.",
        },
        {
          title: "Delivery Estimates",
          body: "Standard shipping: 3–5 business days.\nExpress shipping: 1–2 business days.\nInternational shipping: 7–14 business days depending on destination and customs clearance.\nDelivery windows are estimates and may vary during peak seasons or due to carrier delays.",
        },
        {
          title: "Shipping Rates",
          body: "Enjoy free standard shipping on all orders over $75. For orders below that threshold, a flat rate of $6.95 applies. Express and international rates are calculated at checkout based on weight and destination.",
        },
        {
          title: "Order Tracking",
          body: "Once your order ships, use the tracking number in your confirmation email — or visit our Order Tracking page — to follow your parcel in real time from our warehouse to your door.",
        },
        {
          title: "International Orders",
          body: "We ship to most countries worldwide. Import duties, taxes, and customs fees are the responsibility of the recipient and are not included in the order total. Please check your local regulations before ordering.",
        },
        {
          title: "Undeliverable & Lost Parcels",
          body: "If a parcel is returned as undeliverable due to an incorrect address, we'll contact you to arrange re-shipment. If your tracking shows no movement for more than 7 business days, reach out via our Contact page and we'll investigate immediately.",
        },
      ]}
    />
  );
}
