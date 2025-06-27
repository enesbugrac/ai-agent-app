import { usePrivy, useLogout } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * A React hook that provides a memoized function ('authFetch') to easily make
 * authenticated API calls using Privy. It handles fetching the token
 * and adding the Authorization header.
 *
 * This hook does NOT manage loading, error, or data states internally.
 * The caller receives the raw `Promise<Response>` and must handle it.
 */
export function usePrivateFetch() {
  // Get the token retrieval function from the Privy context
  const { getAccessToken } = usePrivy();
  const { logout } = useLogout();

  // Create the memoized authFetch function
  const privateFetch = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {} // Default to empty object
    ): Promise<T> => {
      // This function now returns Promise<Response>

      let token: string | null = null;
      try {
        // 1. Get the JWT token from Privy
        token = await getAccessToken();
      } catch (tokenError: unknown) {
        // Catch potential errors during the token retrieval process itself
        console.error("Error retrieving Privy token:", tokenError);
        throw new Error(
          `Failed to retrieve authentication token: ${
            tokenError instanceof Error
              ? tokenError.message
              : String(tokenError)
          }`
        );
      }

      if (!token) {
        // Handle the case where getToken() resolves successfully but returns null
        throw new Error(
          "Authentication token could not be retrieved (returned null)."
        );
      }

      // 2. Prepare Headers
      const headers = new Headers(options.headers || {}); // Preserve existing headers provided by the caller
      headers.set("Authorization", `Bearer ${token}`); // Add/overwrite the Authorization header
      headers.set("Content-Type", "application/json");

      // 3. Prepare final fetch options
      const fetchOptions: RequestInit = {
        ...options, // Include user-provided options (method, signal, cache, etc.)
        headers: headers, // Use the prepared headers object
        //  // Use the potentially stringified body
      };

      // 4. Perform the fetch call and return the promise
      // The promise will reject on network errors.
      // For HTTP errors (4xx, 5xx), the promise will resolve, but response.ok will be false.
      // The CALLER is responsible for checking response.ok.
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(fullUrl, fetchOptions);

      // 5. Check for 401 Unauthorized and attempt logout
      if (response.status === 401) {
        console.warn("Unauthorized access. Attempting logout.");
        try {
          await logout();
        } catch (logoutError) {
          console.error(
            "Logout failed after unauthorized access:",
            logoutError
          );
          // Optionally re-throw or handle logout failure as needed
        }
      }

      return response.json() as Promise<T>;
    },
    [getAccessToken]
  ); // The function depends on getToken and logout, so it's memoized based on it

  // Return only the privateFetch function, wrapped in an object structure
  return  useMemo(()=>{
    return {privateFetch}
  },[privateFetch])
}

/**
 * A React hook that provides a memoized function ('publicFetch') to easily make
 * public API calls. It handles constructing the full URL and setting default headers.
 *
 * This hook does NOT manage loading, error, or data states internally.
 * The caller receives the raw `Promise<Response>` and must handle it.
 */
export function usePublicFetch() {
  // Create the memoized publicFetch function
  const publicFetch = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {} // Default to empty object
    ): Promise<T> => {
      // 1. Prepare Headers
      const headers = new Headers(options.headers || {}); // Preserve existing headers
      // Set default Content-Type if not already set
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      // 2. Prepare final fetch options
      const fetchOptions: RequestInit = {
        ...options, // Include user-provided options
        headers: headers, // Use the prepared headers object
      };

      // 3. Perform the fetch call
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(fullUrl, fetchOptions);

      // 4. Basic error check (caller should ideally check response.ok too)
      if (!response.ok) {
        // Attempt to parse error details if available
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (e) {
          // Ignore if response body is not JSON or empty
        }
        console.error(`HTTP error! status: ${response.status}`, errorBody);
        // Throw an error to be caught by the caller
        throw new Error(
          `HTTP error ${response.status}${
            errorBody ? `: ${JSON.stringify(errorBody)}` : ""
          }`
        );
      }

      // 5. Return the parsed JSON response
      return response.json() as Promise<T>;
    },
    [] // No dependencies needed for public fetch
  );

  // Return the publicFetch function
  return  useMemo(()=>{
    return {publicFetch}
  },[publicFetch])
}
