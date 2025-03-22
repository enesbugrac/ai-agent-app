"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import { useThreadsStore } from "@/store/useThreadsStore";
import { useAuthStore } from "@/store/useStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const { threads } = useThreadsStore();
  const router = useRouter();
  const { appUser } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);
  const setThreads = useThreadsStore((state) => state.setThreads);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated]);

  useEffect(() => {
    console.log("DashboardLayout", threads);
  }, [threads]);

  useEffect(() => {
    const initAuth = async () => {
      if (!ready || !privyUser || appUser) return;

      try {
        const userResponse = await fetch("/api/auth", {
          method: "GET",
        });

        if (!userResponse.ok) {
          throw new Error("Auth failed");
        }

        const userData = await userResponse.json();
        setUser(userData);
        setThreads(userData.threads);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, privyUser]);
  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-primary animate-spin" />
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
