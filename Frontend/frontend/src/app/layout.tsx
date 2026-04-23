import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "E-commerce marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <Navbar />

        {/* 🔥 CLIENT LOGIC MOVED HERE */}
        <LayoutWrapper>{children}</LayoutWrapper>

        <Footer />
      </body>
    </html>
  );
}