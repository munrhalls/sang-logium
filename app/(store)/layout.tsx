import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/app/components/ui/header/Header";
import MobileFooter from "@/app/components/ui/footer/MobileFooter";
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
              card: "rounded-sm",
            },
          }}
          dynamic
        >
          <div
            id="wrappe debug-screens"
            className="h-full grid grid-rows-[auto_1fr]"
          >
            <Header />
            <div className="h-full min-h-0 bg-green-700 overflow-y-auto">
              {/* {children} */}
              <div className="bg-indigo-900 h-full grid grid-rows-[1fr_2rem_auto]">
                <div className="bg-yellow-900 h-full"></div>
                <div className="bg-black h-full"></div>
                <MobileFooter />
              </div>
              <div className="bg-pink-900 h-full"></div>
            </div>

            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
