import { Section, SectionHeading } from "@/components/ui/Section";
import { OrderTracker } from "@/components/track/OrderTracker";

export const metadata = { title: "Order Tracking" };

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
