import type { Metadata } from "next";
import { Geist } from "next/font/google";
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
  title: "Aigen",
  description: "AI powered crypto dashboard",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
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
