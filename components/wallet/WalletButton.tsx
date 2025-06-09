"use client";

import React from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { IconBaseProps } from "react-icons";

interface WalletButtonProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  onlyIcon?: boolean;
  onlyText?: boolean;
  iconProps?: IconBaseProps;
}

export default function WalletButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSidebarOpen,
  setIsSidebarOpen,
  onlyIcon,
  onlyText,
  iconProps,
}: WalletButtonProps) {
  return (
    <>
      <motion.button
        onClick={() => setIsSidebarOpen(true)}
        className="f"
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
        {onlyText && <span className="text-sm font-medium text-primary">Wallet</span>}
        {onlyIcon && <FaWallet className="text-primary" size={16} {...iconProps} />}
      </motion.button>
    </>
  );
}
