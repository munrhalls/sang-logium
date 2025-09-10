import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
import Header from "@/app/components/layout/header/Header";
import MobileDrawersWrapper from "@/app/components/layout/mobile/MobileDrawersWrapper";
import CategoriesNav from "../components/layout/categoryMenu/CategoriesNav";
import MobileMenu from "../components/layout/mobile/MobileMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCommercialsByFeature } from "@/sanity/lib/commercials/getCommercialsByFeature";
export const metadata: Metadata = {
  title: "Sang Logium Audio Shop",
  description: "The best audio gear in the world",
};
const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-iceland",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data concurrently to avoid waterfall
  const [categories, heroCommercials] = await Promise.all([
    getAllCategories(),
    getCommercialsByFeature("hero"),
  ]);

  // Sort categories
  categories.sort((a, b) => {
    if (a?.order === undefined || b?.order === undefined) return 0;
    return a?.order - b?.order;
  });

  return (
    <html lang="en" className={`${iceland.className} w-full h-full `}>
      <head>
      </head>
      <ClerkProvider>
        <body
          className={`${iceland.variable} font-sans w-full grid grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_auto_1fr_auto] relative`}
        >
          <Header />
          <CategoriesNav categories={categories} />
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
