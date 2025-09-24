import "./../globals.css";
import type { Metadata } from "next";
// import { Iceland } from "next/font/google";
import { Inter, DM_Serif_Display } from "next/font/google";
import Header from "@/app/components/layout/header/Header";
import MobileDrawersWrapper from "@/app/components/layout/mobile/MobileDrawersWrapper";
import CategoriesWrapper from "../components/layout/categoryMenu/CategoriesWrapper";
import MobileMenu from "../components/layout/mobile/MobileMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import CategoriesSkeleton from "../components/layout/categoryMenu/CategoriesSkeleton";

export const metadata: Metadata = {
  title: "Sang Logium Audio Shop",
  description: "The best audio gear in the world",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${dmSerifDisplay.variable} w-full h-full `}
    >
      <head>
        <link rel="icon" href="/logo-orbit.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* <link
          rel="preload"
          as="image"
          href={firstImageUrl}
          fetchPriority="high"
        /> */}
      </head>
      <ClerkProvider>
        <body
          className={`font-sans w-full grid grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_auto_1fr_auto] relative overflow-x-hidden`}
        >
          <Header />
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesWrapper />
          </Suspense>

          <div className="h-full min-h-0 overflow-hidden relative ">
            <MobileDrawersWrapper />
            <div className="h-full min-h-0 overflow-y-auto relative">
              {children}
            </div>
          </div>
          <MobileMenu />
        </body>
      </ClerkProvider>
    </html>
  );
}
