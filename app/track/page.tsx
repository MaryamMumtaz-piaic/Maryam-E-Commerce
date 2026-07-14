import { Section, SectionHeading } from "@/components/ui/Section";
import { OrderTracker } from "@/components/track/OrderTracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Enter your order number and email to check your delivery status in real-time.",
  openGraph: {
    title: "Order Tracking",
    description: "Enter your order number and email to check your delivery status in real-time.",
  },
  twitter: {
    title: "Order Tracking",
    description: "Enter your order number and email to check your delivery status in real-time.",
  },
};

export default function TrackPage() {
  return (
    <Section className="py-12">
      <SectionHeading
        eyebrow="Customer Support"
        title="Track Your Order"
        description="Enter your order details below to see exactly where your parcel is."
      />
      <OrderTracker />
    </Section>
  );
}
