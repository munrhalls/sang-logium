import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./../globals.css";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import MobileFooter from "@/components/MobileFooter";
import MobileSearchDrawer from "@/components/ui/mobile-search-drawer";
// import useStore from "../store";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <main>
            <Header />
            <MobileSearchDrawer />
            {children}
            <MobileFooter />
          </main>

          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
