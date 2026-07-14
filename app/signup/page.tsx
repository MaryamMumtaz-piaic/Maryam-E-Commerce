import SignupPageComponent from "./signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Maryam account to enjoy faster checkout, track orders, and build your personal wishlist.",
  openGraph: {
    title: "Create Account",
    description: "Create a Maryam account to enjoy faster checkout, track orders, and build your personal wishlist.",
  },
  twitter: {
    title: "Create Account",
    description: "Create a Maryam account to enjoy faster checkout, track orders, and build your personal wishlist.",
  },
};

export default function SignupPage() {
  return <SignupPageComponent />;
}
