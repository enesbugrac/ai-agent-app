"use client";

import Sidebar from "@/components/Sidebar";
import WalletButton from "@/components/wallet/WalletButton";
import { useAuthCache } from "@/hooks/auth.hooks";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthCache();

  useEffect(() => {
    return () => {
      console.log("unmounting")
    }
  }, [])

  return (
    <div className="flex w-[100vw] items-end justify-end">
      <Sidebar />
      <main className="w-[80%] relative ">
        {user && (
          <div className="z-50 fixed top-0 right-0 h-16 flex items-center pr-6 ">
            <WalletButton />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
