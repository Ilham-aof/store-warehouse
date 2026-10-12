import { NextResponse } from "next/server";

export function proxy(request) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/product-history/:path*",
    "/receipt/:path*",
    "/add-product/:path*",
    "/admin/:path*",
  ],
};
