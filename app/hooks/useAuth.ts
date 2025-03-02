import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthStore } from "../store/useStore";

export function useAuthSetup() {
  const { user: privyUser, ready } = usePrivy();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      if (!ready || !privyUser) return;

      try {
        const response = await fetch("/api/auth", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Auth failed");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      }
    };

    initAuth();
  }, [ready, privyUser, setUser]);
}
