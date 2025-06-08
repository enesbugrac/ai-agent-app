// Base ToolJson generic type
export type ToolJson<T> = {
  isUi: boolean; // Indicates if special UI rendering is required
  metadata: T; // Tool-specific data
};

export type ExchangePriceInfo = {
  exchange: string;
  price: number;
  marketPair: string;
};

// Represents an opportunity identified by deviation from the average
export type ArbitrageOpportunity = {
  exchange: string;
  price: number;
  marketPair: string;
  differenceFromAveragePercentage: number;
};

// Represents the scan results for a single cryptocurrency
export type CryptoArbitrageResult = {
  cryptoSymbol: string;
  // cryptoName: string; // Name isn't directly available from this endpoint
  averagePrice: number | null;
  opportunities: ArbitrageOpportunity[];
  checkedExchangesCount: number;
  error?: string;
};

// Top-level metadata structure
export type ArbitrageScanMetadata = {
  type: "arbitrage-scan";
  results: CryptoArbitrageResult[];
};

export type ArbitrageScanTool = ToolJson<ArbitrageScanMetadata>;

export type SwapMetadata = {
  type: "jupiter-swap" | "odos-swap"; // Type identifier for the tool
  status: "success"; // Indicates successful execution
  signature: string; // Solana transaction signature
  explorerUrl: string; // Link to the transaction on an explorer
  inputMint: string; // The input token mint address used
  outputMint: string; // The output token mint address used
  inputAmount: string; // The amount of input tokens swapped (in natural units)
  outputAmount: string; // The amount of input tokens swapped (in natural units)
  inputTokenMetadata: CoinMetadataType;
  outputTokenMetadata: CoinMetadataType;
};

type CoinMetadataType = {
  coinId: number;
  name: string;
  symbol: string;
  slug: string;
  description?: string; // Optional based on @Prop() without required: true
  urls?: {
    // Optional based on @Prop() without required: true
    website?: string[];
    [key: string]: string[] | undefined;
  };
  logo?: string; // Optional based on @Prop() without required: true
  lastUpdated?: Date; // Optional based on @Prop() without required: true (though it has a default)
};

export type SwapTool = ToolJson<SwapMetadata>;

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
  timestamp?:number
};

type CandlePrediction = {
  symbol: string;
  interval: string;
  candles: Candle[];
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    open: number;
    high: number;
    low: number;
    close: number;
  };
};

export type PreditNextCandleMetadata = {
  type: 'candle-prediction';
  prediction: CandlePrediction;
};

export type PreditNextCandleTool = ToolJson<PreditNextCandleMetadata>;

export type PossibleToolJson = ArbitrageScanTool | SwapTool | PreditNextCandleTool;




