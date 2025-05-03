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
  const transactionId = `TXN-${Date.now().toString().slice(-7)}`;

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
      <div className="pt-10 pb-6 px-8">
        <div className="mx-auto mb-6 flex justify-center">
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

        <div className="mb-8">
          <p className="text-secondary mb-1">Transaction ID:</p>
          <p className="font-semibold text-secondary">{transactionId}</p>
        </div>

        <div className="h-px w-full border-t border-border border-dashed mb-8" />

        <div className="flex justify-between items-center max-w-xs mx-auto mb-8 gap-4">
          <div className="flex  items-center">
            <img
              src={toolData.inputTokenMetadata.logo}
              alt={toolData.inputTokenMetadata.symbol}
              className="w-6 h-6"
            />
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">
                {toolData.inputTokenMetadata.symbol}
              </p>
              <p className="text-lg font-bold">{toolData.inputAmount}</p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <BiTransferAlt className="text-black text-xl" />
          </div>

          <div className="flex items-center">
            <img
              src={toolData.outputTokenMetadata.logo}
              alt={toolData.outputTokenMetadata.symbol}
              className="w-6 h-6"
            />
            <div className=" flex items-center gap-2">
              <p className="text-white font-medium">
                {toolData.outputTokenMetadata.symbol}
              </p>
              <p className="text-lg font-bold">{toolData.outputAmount}</p>
            </div>
          </div>
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
