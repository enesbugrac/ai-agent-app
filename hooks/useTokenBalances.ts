import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { tokenCache } from "../utils/cache";
import { processBatch, processBatchWithFallback } from "../utils/batch";
import { priceFeed } from "../services/priceFeed";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { NATIVE_TOKENS } from "../config/tokens";
import { TokenBalance } from "../types/token.types";

interface TokenMetadata {
  name: string;
  symbol: string;
  iconUrl?: string;
  price_usd?: number;
}

interface CoinGeckoResponse {
  name: string;
  symbol: string;
  image?: {
    small?: string;
  };
  market_data?: {
    current_price?: {
      usd?: number;
    };
  };
}

interface ParsedTokenAccount {
  account: {
    data: {
      parsed: {
        info: {
          mint: string;
          tokenAmount: {
            amount: string;
            decimals: number;
          };
        };
      };
    };
  };
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.BNB_MAINNET,
};

const alchemy = new Alchemy(config);

async function getTokenMetadata(address: string): Promise<TokenMetadata | null> {
  const cachedData = tokenCache.get(`metadata:${address}`);
  if (cachedData) {
    const validatedData = validateTokenMetadata(cachedData);
    if (validatedData) {
      return validatedData;
    }
    // If cached data is invalid, remove it from cache
    tokenCache.set(`metadata:${address}`, null);
  }

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${address}`);
    if (!response.ok) throw new Error("Failed to fetch token metadata");

    const rawData: unknown = await response.json();
    if (!isValidCoinGeckoResponse(rawData)) {
      throw new Error("Invalid response format from CoinGecko API");
    }

    const metadata: TokenMetadata = {
      name: rawData.name,
      symbol: rawData.symbol.toUpperCase(),
      iconUrl: rawData.image?.small,
      price_usd: rawData.market_data?.current_price?.usd,
    };

    tokenCache.set(`metadata:${address}`, metadata);
    return metadata;
  } catch (error) {
    console.warn(`Failed to fetch metadata for token ${address}:`, error);
    return null;
  }
}

function validateTokenMetadata(data: unknown): TokenMetadata | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (
    typeof d.name === "string" &&
    typeof d.symbol === "string" &&
    (d.iconUrl === undefined || typeof d.iconUrl === "string") &&
    (d.price_usd === undefined || typeof d.price_usd === "number")
  ) {
    return {
      name: d.name,
      symbol: d.symbol,
      iconUrl: d.iconUrl as string | undefined,
      price_usd: d.price_usd as number | undefined,
    };
  }

  return null;
}

function isValidCoinGeckoResponse(data: unknown): data is CoinGeckoResponse {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    typeof d.symbol === "string" &&
    (d.image === undefined || (typeof d.image === "object" && d.image !== null)) &&
    (d.market_data === undefined ||
      (typeof d.market_data === "object" && d.market_data !== null))
  );
}

export function useTokenBalances(
  walletAddress: string | null,
  network: "solana" | "bsc"
) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { connection } = useConnection();

  useEffect(() => {
    if (!walletAddress) {
      setBalances([]);
      setLoading(false);
      return;
    }

    async function fetchSolanaBalances() {
      try {
        if (!walletAddress || !connection) return;

        const publicKey = new PublicKey(walletAddress);

        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey);
        const solBalanceData: TokenBalance = {
          address: "SOL",
          ...NATIVE_TOKENS.SOL,
          balance: solBalance / LAMPORTS_PER_SOL,
        };

        // Fetch SPL token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        // Process token accounts in batches
        const tokenBalances = await processBatch<ParsedTokenAccount, TokenBalance | null>(
          tokenAccounts.value,
          async (account) => {
            const tokenData = account.account.data.parsed.info;
            const balance =
              Number(tokenData.tokenAmount.amount) /
              Math.pow(10, tokenData.tokenAmount.decimals);

            if (balance === 0) return null;

            const metadata = await getTokenMetadata(tokenData.mint);
            if (!metadata) {
              return {
                address: tokenData.mint,
                symbol: "Unknown",
                name: "Unknown Token",
                balance,
                decimals: tokenData.tokenAmount.decimals,
              };
            }

            return {
              address: tokenData.mint,
              symbol: metadata.symbol,
              name: metadata.name,
              balance,
              decimals: tokenData.tokenAmount.decimals,
              iconUrl: metadata.iconUrl,
              usdValue: metadata.price_usd ? balance * metadata.price_usd : undefined,
            };
          },
          { batchSize: 3, delayBetweenBatches: 500 }
        );

        // Filter out null values (zero balances) and add SOL balance
        const validBalances = [
          solBalanceData,
          ...tokenBalances.filter((balance): balance is TokenBalance => balance !== null),
        ];

        // Fetch prices in batch
        const priceUpdatedBalances = await processBatchWithFallback(
          validBalances,
          async (token) => {
            const price = await priceFeed.getTokenPrice(token.symbol);
            return {
              ...token,
              usdValue: price ? token.balance * Number(price) : token.usdValue,
            };
          },
          async (token) => token, // Fallback to existing usdValue if any
          { batchSize: 5, delayBetweenBatches: 100 }
        );

        setBalances(priceUpdatedBalances);
      } catch (err) {
        console.error("Error fetching Solana balances:", err);
        setError(err as Error);
      }
    }

    async function fetchBNBBalances() {
      try {
        if (!walletAddress) return;

        // Get native BNB balance and token balances
        const [nativeBalance, tokenBalances] = await Promise.all([
          alchemy.core.getBalance(walletAddress),
          alchemy.core.getTokenBalances(walletAddress),
        ]);

        // Process native BNB balance
        const bnbBalanceData: TokenBalance = {
          address: "BNB",
          ...NATIVE_TOKENS.BNB,
          balance: Number(Utils.formatUnits(nativeBalance.toString(), 18)),
        };

        // Process token balances
        const tokenBalancePromises = tokenBalances.tokenBalances
          .filter((token) => token.tokenBalance !== "0") // Filter out zero balances
          .map(async (token) => {
            try {
              const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

              return {
                address: token.contractAddress,
                symbol: metadata.symbol || "Unknown",
                name: metadata.name || "Unknown Token",
                decimals: metadata.decimals || 18,
                iconUrl: metadata.logo || "",
                balance: Number(
                  Utils.formatUnits(token.tokenBalance || "0", metadata.decimals || 18)
                ),
              } as TokenBalance;
            } catch (error) {
              console.error(
                `Error fetching metadata for token ${token.contractAddress}:`,
                error
              );
              return null;
            }
          });

        const tokens = await Promise.all(tokenBalancePromises);
        const validTokens = [
          bnbBalanceData,
          ...tokens.filter((token): token is TokenBalance => token !== null),
        ];

        setBalances(validTokens);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching BNB balances:", err);
        setError(err as Error);
        setLoading(false);
      }
    }

    setLoading(true);
    setError(null);

    if (network === "solana") {
      fetchSolanaBalances();
    } else {
      fetchBNBBalances();
    }
  }, [walletAddress, network, connection]);

  return { balances, loading, error };
}
