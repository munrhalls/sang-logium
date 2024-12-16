import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./../globals.css";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import MobileFooter from "@/components/MobileFooter";
import DesktopCategoriesNav from "@/components/DesktopCategoriesNav";
import MobileCategoriesDrawer from "@/components/MobileCategoriesDrawer";
import MobileSearchDrawer from "@/components/MobileSearchDrawer";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

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
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <div className="h-screen lg:h-auto flex flex-col">
            <Header />
            <DesktopCategoriesNav categories={categories} />

            <main>
              {children}
              <MobileCategoriesDrawer categories={categories} />
              <MobileSearchDrawer />
            </main>

            <MobileFooter />

            <SanityLive />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
