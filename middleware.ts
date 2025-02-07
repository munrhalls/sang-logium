// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     "/((?!_next/image|_next/static|favicon.ico).*)",
//     // "/api/(.*)" // Uncomment if you have API routes to protect
//   ],
// };
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Exclude static files and API routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Include specific routes that need auth
    "/account/:path*",
    "/dashboard/:path*",
  ],
};
