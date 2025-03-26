import { getAccessToken } from "@privy-io/react-auth";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

const API_URL = "http://localhost:4000/api";

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(API_URL);
    }
    return ApiClient.instance;
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    try {
      const {
        skipAuth = false,
        headers: customHeaders,
        signal,
        ...restOptions
      } = options;

      const headers = new Headers(customHeaders || {});
      headers.set("Content-Type", "application/json");

      if (!skipAuth) {
        const token = await getAccessToken();
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...restOptions,
        headers,
        signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API request failed");
      }

      return response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }
}

export const api = ApiClient.getInstance();
