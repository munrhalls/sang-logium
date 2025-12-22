// @ts-expect-error: Type declarations for CSS imports are not present in this project
import "./../globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import Header from "@/app/components/layout/header/Header";

import CategoriesWrapper from "../components/layout/categoryMenu/CategoriesWrapper";
import MobileMenu from "../components/layout/mobile/MobileMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import CategoriesSkeleton from "../components/layout/categoryMenu/CategoriesSkeleton";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sanglogium.com",
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased ${dmSerifDisplay.variable} h-full w-full`}
    >
      <ClerkProvider>
        <body
          className={`relative grid w-full grid-rows-[auto_1fr_auto] overflow-x-hidden font-sans lg:grid-rows-[auto_auto_1fr_auto]`}
        >
          <NuqsAdapter>
            <Header />
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesWrapper />
            </Suspense>

            <div className="relative h-full min-h-0 overflow-hidden">
              <div className="relative h-full min-h-0 overflow-y-auto">
                {children}
              </div>
            </div>

            <MobileMenu />
          </NuqsAdapter>
        </body>
      </ClerkProvider>
    </html>
  );
}
