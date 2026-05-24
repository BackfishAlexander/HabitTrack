import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Habits",
  description: "Daily habit tracker",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <div className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col px-5 pb-28 pt-6 md:pb-10 md:pt-10">
          <Nav />
          <main className="mt-6 flex-1 md:mt-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
