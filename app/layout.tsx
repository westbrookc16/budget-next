

import Navbar from "@/components/Navbar";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@progress/kendo-theme-default/dist/all.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accessible Budget.com",
  description: "Generated by create next app",
};
//import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
//import { useState,createContext } from "react";
import type{ budget } from "@/types/budget";
import type { category } from "@/types/category";


export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
  <ClerkProvider>    

    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        
        <main>{children}</main></body>
    </html>
    
</ClerkProvider>    

  );
}
