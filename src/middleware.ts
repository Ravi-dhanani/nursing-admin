import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const visitorId = request.cookies.get("visitorId")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isSignInRoute = pathname.startsWith("/auth/sign-in");
  const isVerifyRoute = pathname.startsWith("/auth/verify");

  // ✅ CASE 1: No visitorId → go to login
  if (!visitorId) {
    if (!isSignInRoute && !isVerifyRoute) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    return NextResponse.next();
  }

  if (visitorId && !isVerified) {
    if (!isVerifyRoute) {
      return NextResponse.redirect(new URL("/auth/verify", request.url));
    }
    return NextResponse.next();
  }

  // ✅ CASE 3: verified user → block auth pages
  if (visitorId && isVerified) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
