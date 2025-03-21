import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function fetchWithAuth<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const { skipAuth = false, headers: customHeaders, ...restOptions } = options;

    // Get auth token
    const cookieStore = await cookies();
    const privyToken = cookieStore.get("privy-token");

    // Prepare headers
    const headers = new Headers(customHeaders || {});
    headers.set("Content-Type", "application/json");

    if (!skipAuth && privyToken) {
      headers.set("Authorization", `Bearer ${privyToken.value}`);
    }

    const response = await fetch(url, {
      ...restOptions,
      headers,
    });
    if (!response.ok) {
      const jsonRes = await response.json();
      throw new Error(`HTTP error! status: ${jsonRes.message}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
