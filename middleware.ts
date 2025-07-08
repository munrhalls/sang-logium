import { clerkMiddleware } from "@clerk/nextjs/server";
export const middleware = clerkMiddleware();
export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|api/sanity|products|category|sale).*)",
  ],
};
export default middleware;
