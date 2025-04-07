import { IconType } from "react-icons";


export interface AgentData {
    displayId: string;
    id: Agent;
    name: string;
    description: string;
    type: string;
    icon: IconType;
}

export enum Agent {
    ARBITRAGE_ASSISTANT = "arbitrage-assistant",
    JUPITER_SWAP_ASSISTANT = "jupiter-swap-assistant",
    ODO_SWAP_ASSISTANT = "odos-swap-assistant",
}