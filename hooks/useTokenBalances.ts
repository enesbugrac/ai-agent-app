import { useState, useEffect } from "react";
import { NATIVE_TOKENS } from "../config/tokens";
import { TokenBalance } from "../types/token.types";

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
const MORALIS_BASE_URL = "https://deep-index.moralis.io/api/v2.2";
const MORALIS_SOLANA_URL = "https://solana-gateway.moralis.io";

interface MoralisTokenBalance {
  token_address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  logo?: string;
  thumbnail?: string;
  usd_price?: number;
}

interface MoralisSolanaToken {
  associatedTokenAddress: string;
  mint: string;
  name: string;
  symbol: string;
  amount: string;
  amountRaw: string;
  decimals: number;
}

interface MoralisSolanaNativeBalance {
  solana: string;
  lamports: string;
}

interface MoralisSolanaNFT {
  associatedTokenAddress: string;
  mint: string;
  name: string;
  symbol: string;
}

interface MoralisSolanaPortfolio {
  nativeBalance: MoralisSolanaNativeBalance;
  tokens: MoralisSolanaToken[];
  nfts?: MoralisSolanaNFT[]; // We don't need NFTs for token balances
}

export function useTokenBalances(
  walletAddress: string | null,
  network: "solana" | "bsc"
) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setBalances([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (network === "solana") {
      fetchSolanaBalances();
    } else {
      fetchBNBBalances();
    }
  }, [walletAddress, network]);

  async function fetchBNBBalances() {
    try {
      if (!walletAddress) return;

      const response = await fetch(
        `${MORALIS_BASE_URL}/wallets/${walletAddress}/tokens?chain=bsc`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-API-Key": MORALIS_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Moralis API error: ${response.status}`);
      }

      const data = (await response.json()).result;

      // Transform the data into our TokenBalance format
      const tokenBalances: TokenBalance[] = data.map((token: MoralisTokenBalance) => ({
        address: token.token_address,
        symbol: token.symbol,
        name: token.name,
        balance: parseFloat(token.balance) / Math.pow(10, token.decimals),
        decimals: token.decimals,
        iconUrl: token.logo || token.thumbnail,
        usdValue: token.usd_price
          ? (parseFloat(token.balance) / Math.pow(10, token.decimals)) * token.usd_price
          : undefined,
      }));

      // Add native BNB if not included in the response
      const bnbToken = tokenBalances.find(
        (token) =>
          token.symbol.toUpperCase() === "BNB" ||
          token.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      );

      if (!bnbToken) {
        // Fetch native BNB balance separately
        const nativeResponse = await fetch(
          `${MORALIS_BASE_URL}/${walletAddress}/balance?chain=bsc`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-API-Key": MORALIS_API_KEY || "",
            },
          }
        );

        if (nativeResponse.ok) {
          const nativeData = await nativeResponse.json();
          const bnbBalance = parseFloat(nativeData.balance) / 1e18;

          // Add BNB to the token list
          tokenBalances.unshift({
            address: "BNB",
            ...NATIVE_TOKENS.BNB,
            balance: bnbBalance,
            usdValue: nativeData.usd_price
              ? bnbBalance * nativeData.usd_price
              : undefined,
          });
        }
      }

      setBalances(tokenBalances);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching BNB balances:", err);
      setError(err as Error);
      setLoading(false);
    }
  }

  async function fetchSolanaBalances() {
    try {
      if (!walletAddress) return;

      // Fetch Solana portfolio (native SOL + SPL tokens)
      const response = await fetch(
        `${MORALIS_SOLANA_URL}/account/mainnet/${walletAddress}/portfolio`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-API-Key": MORALIS_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Moralis API error: ${response.status}`);
      }

      const data = (await response.json()) as MoralisSolanaPortfolio;

      // Create Solana native balance
      const solBalance = parseFloat(data.nativeBalance.solana);
      const solBalanceData: TokenBalance = {
        address: "SOL",
        ...NATIVE_TOKENS.SOL,
        balance: solBalance,
      };

      // Transform SPL tokens to our format
      const tokenBalances: TokenBalance[] = Array.isArray(data.tokens)
        ? data.tokens
            .filter((token) => parseFloat(token.amount) > 0) // Filter out zero balances
            .map((token) => ({
              address: token.mint,
              symbol: token.symbol || "Unknown",
              name: token.name || "Unknown Token",
              balance: parseFloat(token.amount),
              decimals: token.decimals,
            }))
        : [];

      // Combine native SOL and SPL tokens
      const allBalances = [solBalanceData, ...tokenBalances];

      // Fetch token prices from Moralis price API (optional enhancement)
      // This could be implemented if price info is needed

      setBalances(allBalances);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Solana balances:", err);
      setError(err as Error);
      setLoading(false);
    }
  }

  return { balances, loading, error };
}
