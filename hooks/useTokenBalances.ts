import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { tokenCache } from "../utils/cache";
import { processBatch, processBatchWithFallback } from "../utils/batch";
import { priceFeed } from "../services/priceFeed";
import { JsonRpcProvider, formatUnits } from "ethers";

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  iconUrl?: string;
  usdValue?: number;
}

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

const NATIVE_TOKENS = {
  SOL: {
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  BNB: {
    symbol: "BNB",
    name: "Binance Coin",
    decimals: 18,
    iconUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
  },
};

const BNB_RPC = "https://bsc-dataseed.binance.org";
const BSCSCAN_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;

interface BscTokenInfo {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  balance: string;
}

interface BscTransaction {
  contractAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
}

interface BscTransactionResponse {
  status: string;
  result: BscTransaction[];
}

interface BscBalanceResponse {
  status: string;
  result: string;
}

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

        const provider = new JsonRpcProvider(BNB_RPC);

        // Fetch native BNB balance
        const bnbBalance = await provider.getBalance(walletAddress);
        const bnbBalanceData: TokenBalance = {
          address: "BNB",
          ...NATIVE_TOKENS.BNB,
          balance: Number(formatUnits(bnbBalance, 18)),
        };

        // Fetch BEP-20 token balances from BSCScan API
        const response = await fetch(
          `https://api.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${BSCSCAN_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch BSC token transactions");
        }

        const data = (await response.json()) as BscTransactionResponse;
        if (data.status !== "1" || !data.result) {
          throw new Error("Invalid response from BSCScan API");
        }

        // Get unique token addresses from transactions
        const uniqueTokens = new Set(
          data.result.map((tx) => tx.contractAddress.toLowerCase())
        );
        const tokenInfoPromises: Promise<BscTokenInfo | null>[] = Array.from(
          uniqueTokens
        ).map(async (tokenAddress) => {
          try {
            // Get token balance
            const balanceResponse = await fetch(
              `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${walletAddress}&tag=latest&apikey=${BSCSCAN_API_KEY}`
            );

            if (!balanceResponse.ok) return null;

            const balanceData = (await balanceResponse.json()) as BscBalanceResponse;
            if (balanceData.status !== "1" || Number(balanceData.result) === 0)
              return null;

            // Find token info from transactions
            const tokenTx = data.result.find(
              (tx) => tx.contractAddress.toLowerCase() === tokenAddress
            );

            if (!tokenTx) return null;

            return {
              tokenAddress,
              tokenSymbol: tokenTx.tokenSymbol,
              tokenName: tokenTx.tokenName,
              tokenDecimal: tokenTx.tokenDecimal,
              balance: balanceData.result,
            };
          } catch (error) {
            console.warn(`Failed to fetch balance for token ${tokenAddress}:`, error);
            return null;
          }
        });

        // Process token balances in batches
        const tokenInfos = await processBatch<
          Promise<BscTokenInfo | null>,
          BscTokenInfo | null
        >(tokenInfoPromises, async (promise) => await promise, {
          batchSize: 3,
          delayBetweenBatches: 500,
        });

        // Convert token infos to TokenBalance format
        const tokenBalances = await processBatch<
          BscTokenInfo | null,
          TokenBalance | null
        >(
          tokenInfos,
          async (info) => {
            if (!info) return null;

            const balance =
              Number(info.balance) / Math.pow(10, Number(info.tokenDecimal));
            if (balance === 0) return null;

            const metadata = await getTokenMetadata(info.tokenAddress);
            return {
              address: info.tokenAddress,
              symbol: info.tokenSymbol,
              name: info.tokenName,
              balance,
              decimals: Number(info.tokenDecimal),
              iconUrl: metadata?.iconUrl,
              usdValue: metadata?.price_usd ? balance * metadata.price_usd : undefined,
            };
          },
          { batchSize: 3, delayBetweenBatches: 200 }
        );

        // Filter out null values and add BNB balance
        const validBalances = [
          bnbBalanceData,
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
          async (token) => token,
          { batchSize: 5, delayBetweenBatches: 100 }
        );

        setBalances(priceUpdatedBalances);
      } catch (err) {
        console.error("Error fetching BNB balances:", err);
        setError(err as Error);
      }
    }

    setLoading(true);
    setError(null);

    if (network === "solana") {
      fetchSolanaBalances().finally(() => setLoading(false));
    } else {
      fetchBNBBalances().finally(() => setLoading(false));
    }
  }, [walletAddress, network, connection]);

  return { balances, loading, error };
}
