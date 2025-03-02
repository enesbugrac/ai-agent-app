"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
const solanaConnectors = toSolanaWalletConnectors();
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "https://your-logo-url",
          walletChainType: "ethereum-and-solana",
        },
        loginMethods: ["email", "wallet"],
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

// Create a hook for easy access to auth state
export function useAuth() {
  const { ready, authenticated, login, user, logout } = usePrivy();

  return {
    isReady: ready,
    isAuthenticated: authenticated,
    isLoading: !ready,
    user,
    login,
    logout,
    disableLogin: !ready || (ready && authenticated),
  };
}
