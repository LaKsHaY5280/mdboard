import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { LOGIN } from "@/routes";

export async function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/notes") ||
    request.nextUrl.pathname.startsWith("/profile")
  ) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL(LOGIN, request.url));
    }

    try {
      const payload = await verifyJWT(token);
      if (!payload) {
        return NextResponse.redirect(new URL(LOGIN, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(LOGIN, request.url));
    }
  }

  // Check if authenticated user is trying to access auth pages
  if (request.nextUrl.pathname.startsWith("/auth")) {
    const token = request.cookies.get("token")?.value;

    if (token) {
      try {
        const payload = await verifyJWT(token);
        if (payload) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        // Token is invalid, allow access to auth pages
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/notes/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
