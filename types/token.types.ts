export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  iconUrl?: string;
  usdValue?: number;
}

export interface TokenMetadata {
  iconUrl?: string;
  price_usd?: number;
}
