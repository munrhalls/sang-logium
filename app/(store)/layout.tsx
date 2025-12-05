// TODO CRITICAL!!! ADD SPECULATION API FOR BLAZING FAST PREFETCH AND LOADS
// TODO CRITICAL!!! ADD SPECULATION API Speculation API  Speculation API  Speculation API
// TODO preloading where it fits
// TODO font to WOFF2, add font to public/fonts
// TODO In app/global.css, apply the font-sans and font-mono font families to different elements:
// TODO run @next/bundle-analyzer to see bundle size
// TODO make sure prefetching and code-splitting based on routes is fairly optimal
// TODO use template in the products grid for filter sorts (auto reset)

// TODO #1 !!! DOCS - You should not manually add <head> tags such as <title> and <meta> to root layouts. Instead, you should use the Metadata API which automatically handles advanced requirements such as streaming and de-duplicating <head> elements.

// @ts-expect-error: Type declarations for CSS imports are not present in this project
import "./../globals.css";

import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import Header from "@/app/components/layout/header/Header";
import MobileCategoriesDrawerShell from "@/app/components/layout/mobile/MobileCategoriesDrawerShell";
import MobileSearchDrawerShell from "@/app/components/layout/mobile/MobileSearchDrawerShell";
import CategoriesWrapper from "../components/layout/categoryMenu/CategoriesWrapper";
import MobileMenu from "../components/layout/mobile/MobileMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import CategoriesSkeleton from "../components/layout/categoryMenu/CategoriesSkeleton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sang Logium Audio Shop",
  description: "E-commerce store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

// export const metadata: Metadata = {
//   title: 'Next.js',
// }
export default async function RootLayout({
  children,
  drawer,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased ${dmSerifDisplay.variable} h-full w-full`}
    >
      {/* <head>
        <link
          rel="preload"
          href="/public/HeroMain.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="icon"
          href="public/logo-orbit.svg"
          type="image/svg+xml"
          fetchPriority="high"
          />
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="dns-prefetch" href="https://cdn.sanity.io" />
          </head> */}
      <ClerkProvider>
        <body
          className={`relative grid w-full grid-rows-[auto_1fr_auto] overflow-x-hidden font-sans lg:grid-rows-[auto_auto_1fr_auto]`}
        >
          {drawer}
          <Header />
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesWrapper />
          </Suspense>

          <Link
            href="?menu=true"
            className="h-40 w-full bg-black px-4 py-2 text-center text-red-800"
          >
            Open Menu
          </Link>

          <div className="relative h-full min-h-0 overflow-hidden">
            {/* TODO study understand interleaving pattern - make sure it is
            implemented correctly */}
            {/* TODO make drawer client side comp that accept props
            - renders conditionally based on url
            - has slide in animation
            - is instant
            - is mounted all the time, only changes css to show/hide
            - takes in server comp with categories
            - that comp fetches its data
            - uses streaming pattern
            - target: INSTANT FAST DRAWER SHOW/HIDE WITH URL AS ONLY SOURCE OF TRUTH*/}
            {/* <MobileCategoriesDrawerShell />
            <MobileSearchDrawerShell /> */}
            <div className="relative h-full min-h-0 overflow-y-auto">
              {children}
            </div>
          </div>
          {/* <MobileMenu /> */}
        </body>
      </ClerkProvider>
    </html>
  );
}
