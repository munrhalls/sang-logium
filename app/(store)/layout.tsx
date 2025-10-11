import "./../globals.css";
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import Header from "@/app/components/layout/header/Header";
import MobileDrawersWrapper from "@/app/components/layout/mobile/MobileDrawersWrapper";
import CategoriesWrapper from "../components/layout/categoryMenu/CategoriesWrapper";
import MobileMenu from "../components/layout/mobile/MobileMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import CategoriesSkeleton from "../components/layout/categoryMenu/CategoriesSkeleton";
// import AccountModal from "./AccountModal";

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${dmSerifDisplay.variable} h-full w-full`}
    >
      <head>
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
      </head>
      <ClerkProvider>
        <body
          className={`relative grid w-full grid-rows-[auto_1fr_auto] overflow-x-hidden font-sans lg:grid-rows-[auto_auto_1fr_auto]`}
        >
          {modal}
          <Header />

          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesWrapper />
          </Suspense>

          <div className="relative h-full min-h-0 overflow-hidden">
            <MobileDrawersWrapper />
            <div className="relative h-full min-h-0 overflow-y-auto">
              {children}
              {/* <AccountModal /> */}
            </div>
          </div>
          <MobileMenu />
        </body>
      </ClerkProvider>
    </html>
  );
}
