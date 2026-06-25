import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

const PROTECTED = ["/profile", "/orders", "/checkout"];
const ADMIN_ONLY = ["/admin"];

export async function proxy(req: NextRequest) {
const session = await auth();

  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_ONLY.some((p) => pathname.startsWith(p));

  if ((needsAuth || needsAdmin) && !session?.user) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (needsAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/checkout",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
