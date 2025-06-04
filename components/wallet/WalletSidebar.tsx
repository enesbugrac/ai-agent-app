"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWallet, FaTimes, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import {
  useFundWallet,
  useSolanaWallets,
  useWallets,
  usePrivy,
  useDelegatedActions,
} from "@privy-io/react-auth";
import TokenList from "./TokenList";
import { useTokenBalances } from "../../hooks/useTokenBalances";
import { useFundWallet as useSolanaFundWallet } from "@privy-io/react-auth/solana";

interface WalletSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletSidebar({ isOpen, onClose }: WalletSidebarProps) {
  const [activeTab, setActiveTab] = useState<"solana" | "bsc">("solana");
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const { wallets: solanaWallets, exportWallet: solanaExportWallet } = useSolanaWallets();
  const { user: privyUser, exportWallet } = usePrivy();
  const { delegateWallet } = useDelegatedActions();
  const { fundWallet: solanaFundWallet } = useSolanaFundWallet();

  const evmEmbeddedWallet = useMemo(
    () => wallets.find((wallet) => wallet.connectorType === "embedded"),
    [wallets]
  );

  const solanaEmbeddedWallet = useMemo(
    () => solanaWallets.find((wallet) => wallet.connectorType === "embedded"),
    [solanaWallets]
  );

  const isDelegated = useMemo(() => {
    if (!privyUser) return false;

    const currentWallet =
      activeTab === "solana" ? solanaEmbeddedWallet : evmEmbeddedWallet;
    if (!currentWallet) return false;
    console.log(privyUser.linkedAccounts);

    return privyUser.linkedAccounts.some(
      (account) =>
        account.type === "wallet" &&
        account.connectorType === "embedded" &&
        account.address === currentWallet.address &&
        account.delegated
    );
  }, [activeTab, privyUser, solanaEmbeddedWallet, evmEmbeddedWallet]);

  const handleDelegate = async () => {
    const currentWallet =
      activeTab === "solana" ? solanaEmbeddedWallet : evmEmbeddedWallet;
    if (!currentWallet) return;

    await delegateWallet({
      address: currentWallet.address,
      chainType: activeTab === "solana" ? "solana" : "ethereum",
    });
  };

  const { balances, loading: isLoading } = useTokenBalances(
    activeTab === "solana"
      ? solanaEmbeddedWallet?.address || null
      : evmEmbeddedWallet?.address || null,
    activeTab
  );

  const formattedBalances = useMemo(
    () =>
      balances.map((token) => ({
        ...token,
        balance: token.balance.toFixed(4),
      })),
    [balances]
  );

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-primary font-medium flex items-center gap-2">
                  <FaWallet className="text-primary" /> Wallet
                </h2>
                <button
                  onClick={()=>{
                    console.log("clicked")
                    onClose()}}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4 flex gap-2">
                <motion.button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "solana"
                      ? "bg-primary text-black"
                      : "bg-background-overlay text-secondary hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("solana")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  <SiSolana className="inline-block mr-2" /> Solana
                </motion.button>
                <motion.button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "bsc"
                      ? "bg-primary text-black"
                      : "bg-background-overlay text-secondary hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("bsc")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  <FaEthereum className="inline-block mr-2" /> BNB
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!isDelegated ? (
                  <div className="mb-4">
                    <motion.button
                      onClick={handleDelegate}
                      className="w-full py-2 text-primary bg-primary/10 border border-primary/20 hover:bg-primary/30  rounded-lg transition-colors font-medium"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.03 }}
                    >
                      Delegate {activeTab === "solana" ? "Solana" : "BNB"} Wallet
                    </motion.button>
                  </div>
                ) : null}
                <TokenList
                  tokens={formattedBalances}
                  isLoading={isLoading}
                  networkType={activeTab}
                />
              </div>

              <div className="h-16 flex gap-4 items-center justify-center px-4 border-t border-border">
                <motion.button
                  onClick={() => {
                    if (activeTab === "solana") {
                      if (solanaEmbeddedWallet) {
                        solanaFundWallet(solanaEmbeddedWallet.address);
                      }
                    } else {
                      if (evmEmbeddedWallet) {
                        fundWallet(evmEmbeddedWallet.address, {
                          chain: {
                            id: 56,
                          },
                        });
                      }
                    }
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  Deposit
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (activeTab === "solana") {
                      if (solanaEmbeddedWallet) {
                        solanaExportWallet();
                      }
                    } else {
                      if (evmEmbeddedWallet) {
                        exportWallet();
                      }
                    }
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  Export
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
