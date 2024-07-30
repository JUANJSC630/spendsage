import "./globals.css";

import { Nunito } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import type { Metadata } from "next";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "SpendSage",
  description: "A simple budgeting app to help you keep track of your spending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={nunito.className}>
          <NextTopLoader color="#000"/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
