import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs";
// import { SanityLive } from "@/sanity/lib/live";
import Header from "@/app/components/layout/header/Header";
import MobileDrawersWrapper from "@/app/components/layout/mobile/MobileDrawersWrapper";
import CategoriesWrapper from "../components/layout/categoryMenu/CategoriesWrapper";
import MobileMenu from "../components/layout/mobile/MobileMenu";
// import MobileComponents from "@/app/components/ui/mobile/MobileComponents";

// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/public/logo.png";

export const metadata: Metadata = {
  title: "Sang Logium Audio Shop",
  description: "The best audio gear in the world",
};

const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  display: "optional",
  preload: false,
  variable: "--font-iceland",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${iceland.className} w-full}`}>
      <body className={`${iceland.variable} font-sans w-full`}>
        <div
          id="wrapper"
          className="h-full grid grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_auto_1fr_auto] relative"
        >
          <Header />
          <CategoriesWrapper />
          <div className="h-full min-h-0 overflow-hidden relative">
            <MobileDrawersWrapper />
            <div className="h-full min-h-0 overflow-y-auto relative">
              {children}
            </div>
          </div>
          <MobileMenu />
          {/* <SanityLive /> */}
        </div>
      </body>
    </html>
  );
}
