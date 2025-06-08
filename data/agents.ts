
export enum Agent {
  ARBITRAGE_ASSISTANT = "arbitrage-assistant",
  JUPITER_SWAP_ASSISTANT = "jupiter-swap-assistant",
  ODO_SWAP_ASSISTANT = "odos-swap-assistant", 
  CANDLE_PREDICTION_AGENT = "candle-prediction-assistant",
}
export type AgentActionsMap = {
  [key in Agent]?: Action[];
};

export type ToolType = "arbitrage-scan" | "jupiter-swap" | "odos-swap" | "candle-prediction";

export interface Action {
  title: string;
  description: string;
}
export interface AgentData {
  id: Agent;
  name: string;
  subTitle?: string;
  description?: string;
  type?: ToolType;
  logo?: string;
  actions?: Action[];
}

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

export const agentActions: AgentActionsMap = {
  [Agent.ARBITRAGE_ASSISTANT]: [
    {
      title: 'Get Token Balances',
      description:
        'Get token balances for a wallet, including amount, price, and metadata...',
    },
    {
      title: 'Get Token Holders',
      description:
        'Retrieve a paginated list of the top holders of a specified token...',
    },
    {
      title: 'Get Nfts',
      description:
        'Retrieve NFTs with optional filters. You can get all NFTs, NFTs owned...',
    },
    {
      title: 'Transfer Token',
      description: 'Transfer specified amount of tokens to a recipient\'s address.',
    },
  ],
  [Agent.JUPITER_SWAP_ASSISTANT]: [
    {
      title: 'Swap Token',
      description: 'Swap specified amount of tokens to a recipient\'s address.',
    },
    {
      title: 'Get Token Price',
      description: 'Get the price of a token in USD.',
    },
    {
      title: 'Get Token Holders',
      description: 'Get the holders of a token.',
    },
  ],
  [Agent.ODO_SWAP_ASSISTANT]: [
    {
      title: 'Swap Token',
      description: 'Swap specified amount of tokens to a recipient\'s address.',
    },
    {
      title: 'Get Token Price',
      description: 'Get the price of a token in USD.',
    },
    {
      title: 'Get Token Holders',
      description: 'Get the holders of a token.',
    },
  ],
  [Agent.CANDLE_PREDICTION_AGENT]: [
    {
      title: 'Predict Candle',
      description: 'Predict the direction of a candle based on the previous candles.',
    },
    {
      title: 'Get Candle',
      description: 'Get the previous candles.',
    },
  ],
};

export const agents: AgentData[] = [
  {
    id: Agent.ARBITRAGE_ASSISTANT,
    name: "Arbitra",
    subTitle: "Arbitrage Assistant",
    description: "Finds price differences for a selected token across platforms and helps you execute profitable trades with speed and precision.",
    type: "arbitrage-scan",
    logo: "/agentLogos/arbitra.jpeg",
    actions: agentActions[Agent.ARBITRAGE_ASSISTANT] || []
  },
  {
    id: Agent.JUPITER_SWAP_ASSISTANT,
    name: "Juvex",
    subTitle: "Jupiter Swap Assistant",
    description: "Performs optimized swaps on the Solana Network using Jupiter protocol.",
    type: "jupiter-swap",
    logo: "/agentLogos/juvex.png",
    actions: agentActions[Agent.JUPITER_SWAP_ASSISTANT] || []
  },
  {
    id: Agent.ODO_SWAP_ASSISTANT,
    name: "Oden",
    subTitle: "Odos Swap Assistant",
    description: "Executes efficient swaps on the BSC Network via the Odos protocol.",
    type: "odos-swap",
    logo: "/agentLogos/oden.jpeg",
    actions: agentActions[Agent.ODO_SWAP_ASSISTANT] || []
  },
   {
    id: Agent.CANDLE_PREDICTION_AGENT,
    name: "Predix",
    subTitle: "Candle Prediction Agent",
    description: "Predicts the direction of a candle based on the previous candles.",
    type: "candle-prediction",
    logo: "/agentLogos/candle-prediction.png",
    actions: agentActions[Agent.CANDLE_PREDICTION_AGENT] || []
   }
];


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
    translate: { x: 0, y: 0, z: 150 },
    rotate: { x: 13, y: 0, z: 0 },
    scale: 1,
    opacity: 0,
    img: "agent"
  }
];
