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
];
