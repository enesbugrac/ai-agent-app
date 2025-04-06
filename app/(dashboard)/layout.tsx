"use client";

import Sidebar from "@/components/Sidebar";
import WalletButton from "@/components/wallet/WalletButton";
import { useAuthCache } from "@/hooks/auth.hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthCache();


  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 w-[calc(100%-16rem)] overflow-hidden relative bg-red-400">
        {/* Header */}
        {user && (
          <div className="z-50 absolute top-0 right-0 h-16 flex items-center pr-6 ">
            <WalletButton />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
