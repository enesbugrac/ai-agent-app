"use client";


import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

import { useAuth } from "@/hooks/auth.hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }

  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-primary animate-spin" />
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

