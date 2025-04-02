"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWallet, FaTimes, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { useFundWallet, useSolanaWallets, useWallets } from "@privy-io/react-auth";
interface WalletSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletSidebar({ isOpen, onClose }: WalletSidebarProps) {
  const [activeTab, setActiveTab] = useState<"solana" | "evm">("solana");
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const { wallets: solanaWallets } = useSolanaWallets();

  const evmEmbeddedWallet = useMemo(
    () => wallets.find((wallet) => wallet.connectorType === "embedded"),
    [wallets]
  );

  const solanaEmbeddedWallet = useMemo(
    () => solanaWallets.find((wallet) => wallet.connectorType === "embedded"),
    [solanaWallets]
  );

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 h-full w-80 bg-background-overlay border-l border-border z-50 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-primary font-medium flex items-center gap-2">
                  <FaWallet className="text-primary" /> Wallet
                </h2>
                <button
                  onClick={onClose}
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
                    activeTab === "evm"
                      ? "bg-primary text-black"
                      : "bg-background-overlay text-secondary hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("evm")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  <FaEthereum className="inline-block mr-2" /> EVM
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "solana" ? (
                  <div className="text-center text-secondary py-6">
                    No Solana wallets connected
                  </div>
                ) : (
                  <div className="text-center text-secondary py-6">
                    No EVM wallets connected
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border">
                <motion.button
                  onClick={() => {
                    console.log("burda", evmEmbeddedWallet);
                    console.log("solanaEmbeddedWallet", solanaEmbeddedWallet);

                    if (solanaEmbeddedWallet && evmEmbeddedWallet)
                      fundWallet(
                        activeTab === "solana"
                          ? solanaEmbeddedWallet?.address
                          : evmEmbeddedWallet?.address
                      );
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.03 }}
                >
                  Deposit
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
