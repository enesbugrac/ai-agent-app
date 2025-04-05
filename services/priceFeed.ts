import { tokenCache } from "../utils/cache";

interface PriceData {
  price: number;
  source: string;
  timestamp: number;
}

class PriceFeed {
  private static instance: PriceFeed;
  private readonly CACHE_KEY_PREFIX = "price_";
  private readonly BINANCE_API = "https://api.binance.com/api/v3/ticker/price";
  private readonly COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";

  private constructor() {}

  public static getInstance(): PriceFeed {
    if (!PriceFeed.instance) {
      PriceFeed.instance = new PriceFeed();
    }
    return PriceFeed.instance;
  }

  private async fetchBinancePrice(symbol: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.BINANCE_API}?symbol=${symbol}USDT`);
      if (!response.ok) return null;

      const data = await response.json();
      return Number(data.price);
    } catch (error) {
      console.error(`Error fetching Binance price for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchCoinGeckoPrice(id: string): Promise<number | null> {
    try {
      await tokenCache.checkRateLimit("coingecko");
      const response = await fetch(`${this.COINGECKO_API}?ids=${id}&vs_currencies=usd`);

      if (!response.ok) return null;

      const data = await response.json();
      return data[id]?.usd || null;
    } catch (error) {
      console.error(`Error fetching CoinGecko price for ${id}:`, error);
      return null;
    }
  }

  public async getTokenPrice(
    symbol: string,
    coingeckoId?: string
  ): Promise<PriceData | null> {
    // Try cache first
    const cacheKey = `${this.CACHE_KEY_PREFIX}${symbol}`;
    const cachedPrice = await tokenCache.get<PriceData>(cacheKey);
    if (cachedPrice) return cachedPrice;

    // Try Binance first for major tokens
    const binancePrice = await this.fetchBinancePrice(symbol);
    if (binancePrice) {
      const priceData: PriceData = {
        price: binancePrice,
        source: "binance",
        timestamp: Date.now(),
      };
      tokenCache.set(cacheKey, priceData);
      return priceData;
    }

    // Fallback to CoinGecko if ID is provided
    if (coingeckoId) {
      const geckoPrice = await this.fetchCoinGeckoPrice(coingeckoId);
      if (geckoPrice) {
        const priceData: PriceData = {
          price: geckoPrice,
          source: "coingecko",
          timestamp: Date.now(),
        };
        tokenCache.set(cacheKey, priceData);
        return priceData;
      }
    }

    return null;
  }

  public async getBatchPrices(
    tokens: { symbol: string; coingeckoId?: string }[]
  ): Promise<Map<string, PriceData | null>> {
    const prices = new Map<string, PriceData | null>();

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const promises = batch.map((token) =>
        this.getTokenPrice(token.symbol, token.coingeckoId)
      );
      const results = await Promise.all(promises);

      batch.forEach((token, index) => {
        prices.set(token.symbol, results[index]);
      });

      // Wait a bit between batches
      if (i + batchSize < tokens.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    return prices;
  }
}

export const priceFeed = PriceFeed.getInstance();
