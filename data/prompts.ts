import { FaUser, FaEnvelope, FaFileAlt, FaCode, FaExchangeAlt, FaChartLine, FaWallet, FaCoins, FaSearch, FaHandHoldingUsd } from "react-icons/fa";
import { IconType } from "react-icons";
import { Agent } from "./agents";

export interface Prompt {
  icon: IconType;
  text: string;
  onClick?: () => void;
}

export const generalPrompts: Prompt[] = [
  {
    icon: FaUser,
    text: "Write a to-do list for a personal project or task",
  },
  {
    icon: FaEnvelope,
    text: "Generate an email reply to a job offer",
  },
  {
    icon: FaFileAlt,
    text: "Summarize this article or text for me in one paragraph",
  },
  {
    icon: FaCode,
    text: "How does AI work in a technical capacity",
  },
];

export const agentPrompts: Record<Agent, Prompt[]> = {
  [Agent.ARBITRAGE_ASSISTANT]: [
    {
      icon: FaExchangeAlt,
      text: "Find arbitrage opportunities for SOL across major exchanges",
    },
    {
      icon: FaChartLine,
      text: "What are the current price differences for BONK token?",
    },
    {
      icon: FaWallet,
      text: "Check my wallet balance and suggest profitable arbitrage trades",
    },
    {
      icon: FaCoins,
      text: "What tokens have the highest arbitrage potential right now?",
    },
  ],
  [Agent.JUPITER_SWAP_ASSISTANT]: [
    {
      icon: FaExchangeAlt,
      text: "Swap 10 SOL to USDC with the best rate",
    },
    {
      icon: FaSearch,
      text: "What's the current price of BONK token?",
    },
    {
      icon: FaCoins,
      text: "Show me the best swap routes for SOL to RAY",
    },
    {
      icon: FaWallet,
      text: "What tokens can I swap with my current balance?",
    },
  ],
  [Agent.ODO_SWAP_ASSISTANT]: [
    {
      icon: FaExchangeAlt,
      text: "Swap 5 BNB to BUSD on BSC",
    },
    {
      icon: FaHandHoldingUsd,
      text: "What's the best rate for swapping CAKE to BNB?",
    },
    {
      icon: FaCoins,
      text: "Show me optimal swap paths for BNB to USDT",
    },
    {
      icon: FaWallet,
      text: "What's the slippage for swapping 100 BUSD to CAKE?",
    },
  ],
};

// For backward compatibility
export const prompts = generalPrompts; 