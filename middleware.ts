import { clerkMiddleware } from "@clerk/nextjs/server";

export const middleware = clerkMiddleware();

export const config = {
  matcher: ["/account/:path*", "/profile/:path*"],
};

export default middleware;
