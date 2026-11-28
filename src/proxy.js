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
    "/take-product-stock/:path*",
    "/product-history/:path*",
    "/statistic-chart/:path*",
    "/cashier/:path*",
    "/sale-history/:path*",
    "/service/:path*",
    "/service-history/:path*",
    "/admin/:path*",
    "/saleReceipt/:path*",
    "/serviceReceipt/:path*",
    "/register/:path*",
  ],
};
