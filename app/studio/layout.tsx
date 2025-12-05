import type { Metadata } from "next";
// @ts-expect-error: Type declarations for CSS imports are not present in this project
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Sang logium",
  description: "Sang logium audio shop studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
