import "./../globals.css";
import type { Metadata } from "next";
import { Iceland } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/app/components/ui/header/Header";
import MobileFooter from "@/app/components/ui/footer/MobileFooter";

// import { Footer } from "@/components/ui/Footer";
// import MobileComponents from "@/app/components/ui/mobile/MobileComponents";

// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/public/logo.png";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Enable performance monitoring
  tracesSampleRate: 1.0,
  // Recommended for production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
            className="h-full grid grid-rows-[auto_1fr_auto]"
          >
            <Header />
            <div className="h-full min-h-0 overflow-y-auto">{children}</div>
            <MobileFooter />

            <SanityLive />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
