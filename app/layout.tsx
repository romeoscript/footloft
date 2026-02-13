import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopContextProvider from "@/context/ShopContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Footloft - Premium Footwear Store",
    template: "%s | Footloft",
  },
  description:
    "Discover the latest in footwear at Footloft. Quality, comfort, and style combined in our exclusive collection of shoes for men, women, and kids.",
  keywords: [
    "footwear",
    "shoes",
    "online shopping",
    "Footloft",
    "sneakers",
    "boots",
    "sandals",
  ],
  authors: [{ name: "Footloft Team" }],
  openGraph: {
    title: "Footloft - Premium Footwear Store",
    description:
      "Discover the latest in footwear at Footloft. Quality, comfort, and style combined.",
    url: "https://footloftcloset.com",
    siteName: "Footloft",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Footloft - Premium Footwear Store",
    description: "Discover the latest in footwear at Footloft.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ShopContextProvider>
          <ToastContainer />
          {children}
        </ShopContextProvider>
      </body>
    </html>
  );
}
