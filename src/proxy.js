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
    "/add-product/:path*",
    "/add-product-stock/:path*",
    "/admin/:path*",
    "/cashier/:path*",
    "/order/:path*",
    "/product-history/:path*",
    "/sale-history/:path*",
    "/service-history/:path*",
    "/take-product-stock/:path*",
    "/saleReceipt/:path*",
    "/serviceReceipt/:path*",
    "/register/:path*",
    "/transaction-chart/:path*",
  ],
};
