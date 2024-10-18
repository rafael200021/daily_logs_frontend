"use client";
import { RecoilRoot } from "recoil";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <Toaster  position="top-right"/>

          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
