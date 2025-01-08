import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./../globals.css";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import DesktopCategoriesNav from "@/components/DesktopCategoriesNav";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import CategorySkeleton from "@/components/DesktopCategoriesSkeleton";
import MobileComponents from "@/components/ui/mobile/MobileComponents";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sang Logium Audio Shop",
  description: "The best audio gear in the world",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getAllCategories();

  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>
          <div id="wrapper">
            <Header />
            <Suspense fallback={<CategorySkeleton />}>
              <DesktopCategoriesNav categories={categories} />
            </Suspense>
            <main className="min-h-full">
              {children}
              <MobileComponents categories={categories} />
            </main>
            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
