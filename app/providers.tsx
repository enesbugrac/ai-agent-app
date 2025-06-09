"use client";

import LoadingAnimation from "@/components/loading/LoadingAnimation";
import { useAuthAsync } from "@/hooks/auth.hooks";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { bsc } from "viem/chains";

const solanaConnectors = toSolanaWalletConnectors();
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          logo: "https://i.imgur.com/oCSydNJ.png",
          walletChainType: "ethereum-and-solana",
        },

        loginMethods: ["email", "wallet"],
        supportedChains: [bsc],
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
      }}
    >
      <AuthQueryProvider>{children}</AuthQueryProvider>
    </PrivyProvider>
  );
}

function AuthQueryProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthAsync();

  return (
    <>
      {isLoading && <LoadingAnimation />}
      {children}
    </>
  );
}
