import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("privy-token");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/(dashboard)");
  const isRootPath = request.nextUrl.pathname === "/";

  if (!token && (isDashboardRoute || request.nextUrl.pathname !== "/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isRootPath) {
    return NextResponse.redirect(new URL("/terminal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|logo.png).*)"],
};
