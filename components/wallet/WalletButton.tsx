"use client";

import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import WalletSidebar from "./WalletSidebar";

export default function WalletButton() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsSidebarOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-overlay transition-colors text-secondary hover:text-primary"
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.01,
          transition: {
            duration: 0.05,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
        whileTap={{
          scale: 0.99,
          transition: {
            duration: 0.03,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
      >
        <motion.div
          animate={{
            rotate: isSidebarOpen ? [0, 10, -10, 0] : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          <FaWallet className="text-lg" />
        </motion.div>
        <span className="text-sm font-medium">Wallet</span>
      </motion.button>

      <WalletSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
