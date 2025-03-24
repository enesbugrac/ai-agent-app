import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  isStream?: boolean;
}

export async function fetchWithAuth<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T | Response> {
  try {
    const {
      skipAuth = false,
      isStream = false,
      headers: customHeaders,
      ...restOptions
    } = options;

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

    if (isStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                console.log("value", value);
                console.log("done", done);

                if (done) break;

                // Uint8Array'i text'e çevir
                const text = decoder.decode(value);
                // Text'i UTF-8 bytes'a çevir
                const bytes = new TextEncoder().encode(text);
                controller.enqueue(bytes);
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
