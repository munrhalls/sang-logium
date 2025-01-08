import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/image|_next/static|favicon.ico).*)",
    // "/api/(.*)" // Uncomment if you have API routes to protect
  ],
};
