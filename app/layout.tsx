import Navbar from "@/components/Navbar";
import { QueryProvider } from "@/components/queryprovider";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@progress/kendo-theme-default/dist/all.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accessible Budget.com",
  description: "Generated by create next app",
};

import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body className={inter.className}>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
