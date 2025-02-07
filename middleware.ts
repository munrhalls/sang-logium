// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     "/((?!_next/image|_next/static|favicon.ico).*)",
//     // "/api/(.*)" // Uncomment if you have API routes to protect
//   ],
// };
export const config = {
  matcher: [
    "/(api|trpc)(.*)",
    "/dashboard",
    "/account",
    // Add only protected routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
