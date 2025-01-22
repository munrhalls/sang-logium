import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/app/components/ui/header/Header";
// import { Footer } from "@/components/ui/Footer";
// import MobileComponents from "@/app/components/ui/mobile/MobileComponents";

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
  return (
    <html lang="en" className={iceland.className}>
      <body className={`${iceland.variable} font-sans`}>
        <ClerkProvider
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-lg",
            },
          }}
          dynamic
        >
          <div id="wrapper" className="grid grid-rows-[auto,1fr,auto]">
            <Header />
            {children}
            {/* <MobileComponents /> */}
            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
