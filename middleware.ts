import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async () => {});

export const config = {
  matcher: [
    "/account/:path*",
    "/profile/:path*",
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
