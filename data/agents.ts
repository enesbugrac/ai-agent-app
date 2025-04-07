import { FaChartLine } from "react-icons/fa";
import { IconType } from "react-icons";
import { AgentData, Agent } from "@/types/agent.types";


export const agents: AgentData[] = [
  {
    id: Agent.ARBITRAGE_ASSISTANT,
    displayId: "Arbitrage Assistant",
    name: "Arbitrage Assistant",
    description: "Arbitrage between exchanges",
    type: "Arbitrage",
    icon: FaChartLine,
  },
  {
    id: Agent.JUPITER_SWAP_ASSISTANT,
    displayId: "Jupiter Swap Assistant",
    name: "Jupiter Swap Assistant",
    description: "Swap tokens on Solana Network",
    type: "Swap",
    icon: FaChartLine,
  },
  {
    id: Agent.ODO_SWAP_ASSISTANT,
    displayId: "Odos Swap Assistant",
    name: "Odos Swap Assistant",
    description: "Swap tokens on BSC Network",
    type: "Swap",
    icon: FaChartLine,
  },
];

export interface LandingAgents extends AgentData {
  translate: {
    x: number;
    y: number;
    z: number;
  }
  rotate: {
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

