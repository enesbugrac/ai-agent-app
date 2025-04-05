"use client";

import React from 'react';
import { ArbitrageScanMetadata } from '@/types/tools.types';
import { MessageRole, ThreadMessage } from '@/types/thread.types';

// Sample arbitrage data for demonstration - only BTC
const sampleArbitrageData: ArbitrageScanMetadata = {
  type: 'arbitrage-scan',
  results: [
    {
      cryptoSymbol: 'BTC',
      averagePrice: 68245.32,
      checkedExchangesCount: 4,
      opportunities: [
        {
          exchange: 'Binance',
          price: 68350.25,
          marketPair: 'BTC/USDT',
          differenceFromAveragePercentage: 0.15
        },
        {
          exchange: 'Coinbase',
          price: 68190.50,
          marketPair: 'BTC/USD',
          differenceFromAveragePercentage: -0.08
        },
        {
          exchange: 'Kraken',
          price: 68275.75,
          marketPair: 'BTC/USD',
          differenceFromAveragePercentage: 0.04
        },
        {
          exchange: 'FTX',
          price: 68165.00,
          marketPair: 'BTC/USDT',
          differenceFromAveragePercentage: -0.12
        }
      ]
    }
  ]
};

// Create a sample thread message with the arbitrage data
export const createSampleArbitrageMessage = (): ThreadMessage => {
  return {
    _id: 'sample-arbitrage-message',
    threadId: 'sample-thread-id',
    role: MessageRole.ASSISTANT,
    content: "I've scanned multiple exchanges for arbitrage opportunities. Here are the current price differences for BTC:",
    createdAt: new Date().toISOString(),
    toolJson: {
      isUi: true,
      metadata: sampleArbitrageData
    }
  };
};

// Example usage:
// 
// import { createSampleArbitrageMessage } from '@/examples/arbitrageExample';
// import AIMessage from '@/components/ai/AIMessage';
// 
// const ArbitrageExample = () => {
//   const sampleMessage = createSampleArbitrageMessage();
//   
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Arbitrage Scan Example</h2>
//       <AIMessage message={sampleMessage} />
//     </div>
//   );
// }; 