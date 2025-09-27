import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const url = request.nextUrl.clone();

  if (url.pathname === "/account") {
    url.pathname = "/";
    url.searchParams.set("drawer", "account");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/account/:path*",
    "/profile/:path*",
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
