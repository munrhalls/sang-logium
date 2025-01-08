import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./../globals.css";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import DesktopCategoriesNav from "@/components/DesktopCategoriesNav";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import dynamic from "next/dynamic";
import CategorySkeleton from "@/components/DesktopCategoriesSkeleton";
const MobileCategoriesDrawer = dynamic(
  () => import("@/components/MobileCategoriesDrawer"),
  {
    loading: () => null,
    ssr: false,
  }
);
const MobileSearchDrawer = dynamic(
  () => import("@/components/MobileSearchDrawer"),
  {
    loading: () => null,
    ssr: false,
  }
);

const MobileFooter = dynamic(() => import("@/components/MobileFooter"), {
  loading: () => null,
});
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
              <MobileCategoriesDrawer categories={categories} />
              <MobileSearchDrawer />
            </main>
            <MobileFooter />
            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
