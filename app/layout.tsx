import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aigen",
  description: "Windows 98 style crypto dashboard",
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
      <body className={`${geist.variable} w-screen h-screen`}>
        <Providers>
          <div className="flex h-full">
            <main className="flex-1">{children}</main>
          </div>
          <ToastContainer
            position="top-right"
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  );
}
