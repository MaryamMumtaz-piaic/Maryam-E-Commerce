import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <PolicyPage
      eyebrow="Payment & Checkout"
      title="Delivery Information"
      updated="June 24, 2026"
      intro="From dispatch to doorstep, here's how we get your order to you and what to expect along the way."
      sections={[
        {
          title: "Delivery Partners",
          body: "We work with trusted carriers to ensure reliable, trackable delivery. The carrier for your order depends on your location and the shipping method you choose at checkout.",
        },
        {
          title: "Delivery Windows",
          body: "Standard delivery arrives in 3–5 business days, express in 1–2 business days, and international in 7–14 business days. You'll receive an estimated delivery date in your shipping confirmation email.",
        },
        {
          title: "Tracking Your Delivery",
          body: "Every shipment includes a tracking number. Follow your parcel's journey in real time from our Order Tracking page or directly through the carrier's website using the link in your email.",
        },
        {
          title: "Delivery Attempts",
          body: "If you're not home, most carriers will attempt delivery again the next business day or leave a card with pickup instructions. Some orders may require a signature on delivery for security.",
        },
        {
          title: "Safe & Contactless Delivery",
          body: "Where available, you can request contactless delivery or leave notes for the carrier (such as a safe place to leave your parcel) during checkout.",
        },
        {
          title: "Delivery Issues",
          body: "If your parcel is delayed, marked delivered but not received, or arrives damaged, contact us within 48 hours. We'll work with the carrier to locate your order or arrange a replacement.",
        },
      ]}
    />
  );
}
