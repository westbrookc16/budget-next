
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@progress/kendo-theme-default/dist/all.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accessible Budget.com",
  description: "Generated by create next app",
};

export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <AuthProvider>
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}</body>
    </html>
    </AuthProvider>
    
  );
}
