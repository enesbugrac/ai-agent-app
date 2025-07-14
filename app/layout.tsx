import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aigen | AI-Powered Crypto Dashboard",
  description:
    "Aigen is an innovative AI-powered crypto dashboard. Track your portfolio, analyze the market, and join immersive blockchain events, all in one place.",
  keywords: [
    "AI",
    "crypto dashboard",
    "blockchain",
    "portfolio tracker",
    "market analysis",
    "Binance Smart Chain",
    "Solana",
    "Web3",
    "NFT events",
    "decentralized platform",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo.jpeg", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Aigen | AI-Powered Crypto Dashboard",
    description:
      "Aigen is an innovative AI-powered crypto dashboard. Track your portfolio, analyze the market, and join immersive blockchain events, all in one place.",
    url: "https://www.aigenlab.io/", // Update to your actual domain if different
    siteName: "Aigen",
    images: [
      {
        url: "/logo.jpeg",
        width: 512,
        height: 512,
        alt: "Aigen Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aigen | AI-Powered Crypto Dashboard",
    description:
      "Aigen is an innovative AI-powered crypto dashboard. Track your portfolio, analyze the market, and join immersive blockchain events, all in one place.",
    images: ["/logo.jpeg"],
    site: "@@Aigenlabio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${geist.variable} h-screen`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S1B72JQS3Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S1B72JQS3Z');
          `}
        </Script>

        <Providers>
          <main className="flex-1 ">{children}</main>
          <ToastContainer
            position="top-right"
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />
          <Modal />
        </Providers>

      </body>
    </html>
  );
}
