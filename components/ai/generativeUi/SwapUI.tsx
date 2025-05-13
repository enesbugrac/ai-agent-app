import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";
import Confetti from "react-confetti";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { SwapMetadata } from "@/types/tools.types";

interface SwapUIProps {
  toolData: SwapMetadata;
}

const SwapUI: React.FC<SwapUIProps> = ({ toolData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);

    // Handle small decimals
    if (numAmount <= 0.001) {
      return <span className="text-sm font-bold">{numAmount}</span>;
    }

    // Handle regular numbers with K/M suffixes
    if (numAmount >= 1000 && numAmount < 10000) {
      return `${(numAmount / 1000).toFixed(1)}K`;
    }
    if (numAmount >= 10000 && numAmount < 100000) {
      return `${(numAmount / 1000).toFixed(0)}K`;
    }
    if (numAmount >= 100000 && numAmount < 1000000) {
      return `${(numAmount / 1000).toFixed(0)}K`;
    }
    if (numAmount >= 1000000 && numAmount < 10000000) {
      return `${(numAmount / 1000000).toFixed(1)}M`;
    }

    // For regular numbers less than 1000
    if (numAmount < 1000) {
      return numAmount.toFixed(1);
    }

    return amount.substring(0, 4);
  };

  const TokenAmount = ({
    type,
    amount,
    logo,
    symbol,
  }: {
    type: "input" | "output";
    amount: string;
    logo: string;
    symbol: string;
  }) => {
    return (
      <div
        className={`flex flex-1 items-center ${
          type === "input" ? "justify-start" : "justify-end"
        }`}
      >
        <img src={logo} alt={symbol} className="w-6 h-6 rounded-full mr-1" />
        <div className=" flex items-center gap-2">
          <p className="text-white font-medium">{symbol}</p>
          <p className="text-lg font-bold">{formatAmount(amount)}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-[50%] bg-[#1A1D23] rounded-xl overflow-hidden  text-center relative"
    >
      <div className="absolute top-0 left-0 pointer-events-none z-10">
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={200}
          recycle={false}
        />
      </div>
      <div className="py-6 px-8">
        <div className="w-full mb-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-background-highlight p-1.5">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
              <FaCheckCircle className="text-black text-3xl" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Swap success!</h2>

        <p className="text-secondary mb-6 max-w-sm mx-auto">
          Congratulations! Your coin swap was completed successfully.
        </p>

        <div className="h-px w-full border-t border-border border-dashed mb-6" />

        <div className="w-full flex justify-between items-center mb-6">
          <TokenAmount
            type="input"
            amount={toolData.inputAmount}
            logo={toolData.inputTokenMetadata.logo!}
            symbol={toolData.inputTokenMetadata.symbol}
          />

          <div className="flex flex-2 items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <BiTransferAlt className="text-black text-xl " />
            </div>
          </div>

          <TokenAmount
            type="output"
            amount={toolData.outputAmount}
            logo={toolData.outputTokenMetadata.logo!}
            symbol={toolData.outputTokenMetadata.symbol}
          />
        </div>

        <div className="space-y-3">
          <a
            href={toolData.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-primary hover:bg-primary/90 text-black font-medium rounded-full transition-colors"
          >
            View receipt
          </a>
        </div>
      </div>
    </div>
  );
};

export default SwapUI;
