import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const visitorId = request.cookies.get("visitorId")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isVerifyRoute = pathname.startsWith("/auth/verify");

  if (
    !visitorId &&
    !pathname.startsWith("/auth/sign-in") &&
    !pathname.startsWith("/auth/verify")
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (visitorId && !isVerified && !isVerifyRoute) {
    return NextResponse.redirect(new URL("/auth/verify", request.url));
  }

  if (visitorId && isVerified && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
