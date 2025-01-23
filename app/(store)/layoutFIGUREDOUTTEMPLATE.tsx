import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/app/components/ui/header/Header";
import MobileFooter from "@/app/components/ui/footer/MobileFooter";
// import { Footer } from "@/components/ui/Footer";
// import MobileComponents from "@/app/components/ui/mobile/MobileComponents";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
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
    <html lang="en" className={`${iceland.className} w-full}`}>
      <body className={`${iceland.variable} font-sans w-full`}>
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
            id="wrapper debug-screens"
            className="h-full grid grid-rows-[auto_1fr]"
          >
            <Header />
            <div className="h-full min-h-0 min-w-0 overflow-y-auto grid grid-rows-[1fr_auto]">
              {/* {children} */}

              {/* this is its own thing in cell 1fr: carousel grid with 1fr, 2rem at bottom*/}
              <div className="h-full border-black border-4 grid grid-rows-[1fr_2rem]">
                {/* and now, this is its own thing inside carousel: carousel container, setting the 1fr cell, and 2rem cell */}
                <div className="h-full border-purple-800 bg-purple-800">
                  {/* slider track in the 1fr cell*/}
                  <div className="relative h-full w-full z-30 overflow-hidden">
                    {/* slides container inside slider track */}
                    <div className="h-full bg-blue-800 flex">
                      {/* actual slides */}
                      <div className="/* slide */ z-50 relative h-full w-full bg-teal-500">
                        {/* a slide */}
                        {/* first - image inset 0 absolute, fills entire container above */}
                        {/* second - text or products commercial */}
                        <div className="h-full w-full grid  gap-4 border-3 border-yellow-500">
                          {/* products commercial */}
                          <div className="h-full bg-pink-700 grid grid-cols-[33%_2fr] ">
                            {/* a product card*/}
                            <div className="h-full bg-green-400 grid place-content-center">
                              {/* prod image cell */}
                              <div className="h-full bg-black text-white">
                                {/* prod img */}
                                img
                              </div>
                            </div>
                            <div className="h-full bg-orange-400 grid place-content-center">
                              {/* prod text cell */}
                              <div className="h-full bg-pink-800">
                                {/* prod text */}
                                txt
                              </div>
                            </div>
                          </div>
                          <div className="h-full bg-pink-700 grid grid-cols-[33%_2fr] ">
                            {/* a product card*/}
                            <div className="h-full bg-green-400 grid place-content-center">
                              {/* prod image cell */}
                              <div className="h-full bg-black text-white">
                                {/* prod img */}
                                img
                              </div>
                            </div>
                            <div className="h-full bg-orange-400 grid place-content-center">
                              {/* prod text cell */}
                              <div className="h-full bg-pink-800">
                                {/* prod text */}
                                txt
                              </div>
                            </div>
                          </div>
                          <div className="h-full bg-pink-700 grid grid-cols-[33%_2fr] ">
                            {/* a product card*/}
                            <div className="h-full bg-green-400 grid place-content-center">
                              {/* prod image cell */}
                              <div className="h-full bg-black text-white">
                                {/* prod img */}
                                img
                              </div>
                            </div>
                            <div className="h-full bg-orange-400 grid place-content-center">
                              {/* prod text cell */}
                              <div className="h-full bg-pink-800">
                                {/* prod text */}
                                txt
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-full border-gray-800 bg-black text-white">
                  {/* dots in the 2rem cell */}
                  dots
                </div>
              </div>
              {/* and then, this is its own thing in cell auto: footer */}
              <MobileFooter />
            </div>

            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}

{
  /* <Link
                          href="/"
                          className="h-full grid place-content-center text-white"
                        >
                          <Image
                            loading="lazy"
                            decoding="async"
                            quality={100}
                            sizes="(max-width: 768px) 36vw, 25vw"
                            // src="/api/placeholder/80/80"
                            src={logo}
                            // alt={product.name}
                            alt={""}
                            height={80}
                            width={80}
                            className="h-full block rounded-sm"
                          />
                        </Link> */
}
