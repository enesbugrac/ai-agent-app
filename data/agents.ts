import { FaStore, FaUserFriends, FaRobot, FaBrain, FaChartLine } from "react-icons/fa";
import { IconType } from "react-icons";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: IconType;
}

export const agents: Agent[] = [
  {
    id: "sniper-bot",
    name: "Sniper",
    description: "Snipe new tokens on pump.fun",
    type: "Token Sniper",
    icon: FaChartLine,
  },
  {
    id: "neural-ai",
    name: "Neural",
    description: "Advanced AI model for market analysis and predictions.",
    type: "Market Analyzer",
    icon: FaBrain,
  },
  {
    id: "auto-trade",
    name: "AutoTrade",
    description: "Automated trading with customizable strategies.",
    type: "Trading Bot",
    icon: FaRobot,
  },
  {
    id: "social-sense",
    name: "SocialSense",
    description: "Social media sentiment analysis for crypto markets.",
    type: "Social Analyzer",
    icon: FaUserFriends,
  },
  {
    id: "referral-bot",
    name: "ReferralBot",
    description: "Earn rewards by referring friends and growing your network with our automated referral system.",
    type: "AI Trading Bot",
    icon: FaStore,
  },
]; 