import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TokenListProps {
  tokens: {
    symbol: string;
    name: string;
    balance: string;
    iconUrl?: string;
    usdValue?: number;
  }[];
  isLoading: boolean;
  networkType: "solana" | "bsc";
}

export default function TokenList({ tokens, isLoading, networkType }: TokenListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tokens.length) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-secondary mb-4">Start your journey by depositing tokens!</p>
        <p className="text-sm text-muted-foreground">
          Experience the best of {networkType === "solana" ? "Solana" : "BNB"} with your
          first deposit
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token, index) => (
        <motion.div
          key={`${token.symbol}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="bg-background-overlay rounded-lg p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {token.iconUrl ? (
              <Image
                src={token.iconUrl}
                alt={token.symbol}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium">{token.symbol.slice(0, 2)}</span>
              </div>
            )}
            <div>
              <p className="font-medium text-primary">{token.symbol}</p>
              <p className="text-sm text-secondary">{token.balance}</p>
            </div>
          </div>
          {token.usdValue && (
            <p className="text-sm text-secondary">${token.usdValue.toFixed(2)}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
