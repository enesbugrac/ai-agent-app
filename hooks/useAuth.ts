import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthStore } from "@/store/useStore";
import { useThreadsStore } from "@/store/useThreadsStore";

export function useAuthSetup() {
  const { user: privyUser, ready } = usePrivy();
  const setUser = useAuthStore((state) => state.setUser);
  const setThreads = useThreadsStore((state) => state.setThreads);

  useEffect(() => {
    const initAuth = async () => {
      if (!ready || !privyUser) return;

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

        console.log("userData", userData);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      }
    };

    initAuth();
  }, [ready, privyUser, setUser, setThreads]);
}
