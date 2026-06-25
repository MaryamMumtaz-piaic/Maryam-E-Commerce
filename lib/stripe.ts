import Stripe from "stripe";

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }
  if (!_stripe) {
    // Use the SDK's pinned API version to avoid version-string type mismatches.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}
