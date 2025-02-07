// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     "/((?!_next/image|_next/static|favicon.ico).*)",
//     // "/api/(.*)" // Uncomment if you have API routes to protect
//   ],
// };
import { clerkMiddleware } from "@clerk/nextjs/server";

export const middleware = clerkMiddleware();

export const config = {
  matcher: [
    // Only check auth for protected routes
    "/account/:path*",
    "/dashboard/:path*",
    // Exclude static assets and public routes
    "/((?!_next/static|_next/image|favicon.ico|api/sanity|products|category|sale).*)",
  ],
};

// Default export for wider compatibility
export default middleware;
