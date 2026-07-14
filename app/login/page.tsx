import LoginPageComponent from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Maryam account to manage your profile, view orders, and access your personal wishlist.",
  openGraph: {
    title: "Sign In",
    description: "Sign in to your Maryam account to manage your profile, view orders, and access your personal wishlist.",
  },
  twitter: {
    title: "Sign In",
    description: "Sign in to your Maryam account to manage your profile, view orders, and access your personal wishlist.",
  },
};

export default function LoginPage() {
  return <LoginPageComponent />;
}
