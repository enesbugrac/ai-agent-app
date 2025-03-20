import { FaChartLine } from "react-icons/fa";
import { IconType } from "react-icons";

export interface Agent {
  displayId: string;
  id: string;
  name: string;
  description: string;
  type: string;
  icon: IconType;
}

export const agents: Agent[] = [
  {
    id: "asst_DNjos1zUGKOjV7lgD6wwtxRJ",
    displayId: "sniper-bot",
    name: "Sniper",
    description: "Snipe new tokens on pump.fun",
    type: "Token Sniper",
    icon: FaChartLine,
  },
  {
    id: "asst_XKw92mzLPQnR8vHyE5tBsF3M",
    displayId: "trend-master",
    name: "Trend Master",
    description: "Analyze market trends and identify opportunities",
    type: "Market Analyzer",
    icon: FaChartLine,
  },
  {
    id: "asst_YNp47qxWJTvS9uGkH3mDcL8B",
    displayId: "momentum-tracker",
    name: "Momentum Tracker",
    description: "Track token momentum and volume patterns",
    type: "", 
    icon: FaChartLine,
  },
  {
    id: "asst_ZRt83nxVKUmP5wFjC4gBhQ9A",
    displayId: "whale-watcher",
    name: "Whale Watcher",
    description: "Monitor large wallet movements and whale activity",
    type: "Wallet Tracker",
    icon: FaChartLine,
  },
  {
    id: "asst_WMs15byXNRkQ7vLpD2nFtH6C",
    displayId: "pattern-finder",
    name: "Pattern Finder",
    description: "Identify recurring chart patterns and setups",
    type: "Technical Analysis",
    icon: FaChartLine,
  },
  {
    id: "asst_VLk64mzYPSnT8wHxJ1rCqG5B",
    displayId: "liquidity-hunter",
    name: "Liquidity Hunter",
    description: "Find tokens with strong liquidity profiles",
    type: "Liquidity Analyzer",
    icon: FaChartLine,
  }
];

export interface LandingAgents extends Agent {
   translate:{
    x: number;
    y: number;
    z: number;
   }
   rotate:{
    x: number;
    y: number;
    z: number;
   }
   opacity: number;
   scale: number;
   img: string;
}

export const landingAgents: LandingAgents[] = [
  {
    ...agents[0],
    translate: { x: 0, y: 0, z: 400 },
    rotate: { x: 13, y: 0, z: 0 },
    scale: 1,
    opacity: 0,
    img: "agent"
  },
  {
    ...agents[1],
    translate: { x: 0, y: 0, z: 300 },
    rotate: { x: 13, y: 0, z: 0 },
    scale: 1,
    opacity: 0,
    img: "agent"
  },
  {
    ...agents[2],
    translate: { x: 0, y: 0, z: 150 },
    rotate: { x: 13, y: 0, z: 0 },
    scale: 1,
    opacity: 0,
    img: "agent"
  },
  {
    ...agents[3],
    translate: { x: 0, y: 0, z: 400 },
    rotate: { x: 13, y: 0, z: 0 },
    scale: 1,
    opacity: 1,
    img: "https://framerusercontent.com/images/Iv9LnQg69wY97QUjeRr8Rim2MFs.png?scale-down-to=512"
  },
  // {
  //   ...agents[4],
  //   translate: { x: 0, y: 0, z: 400 },
  //   rotate: { x: 13, y: 0, z: 0 },
  //   scale: 1,
  //   opacity: 1,
  // },
  // {
  //   ...agents[5],
  //   translate: { x: 0, y: 0, z: 400 },
  //   rotate: { x: 13, y: 0, z: 0 },
  //   scale: 1,
  //   opacity: 1,
  // },
];

