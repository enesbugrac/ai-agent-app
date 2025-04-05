export interface BatchOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
  maxRetries?: number;
  retryDelay?: number;
}

const DEFAULT_OPTIONS: Required<BatchOptions> = {
  batchSize: 5,
  delayBetweenBatches: 200,
  maxRetries: 3,
  retryDelay: 1000,
};

export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: BatchOptions = {}
): Promise<R[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const results: R[] = [];

  for (let i = 0; i < items.length; i += opts.batchSize) {
    const batch = items.slice(i, i + opts.batchSize);
    const batchPromises = batch.map(async (item) => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
        try {
          return await processor(item);
        } catch (error) {
          lastError = error as Error;
          if (attempt < opts.maxRetries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, opts.retryDelay * Math.pow(2, attempt))
            );
          }
        }
      }

      throw lastError || new Error("All retries failed");
    });

    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      if (i + opts.batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, opts.delayBetweenBatches));
      }
    } catch (error) {
      console.error("Error processing batch:", error);
      throw error;
    }
  }

  return results;
}

export async function processBatchWithFallback<T, R>(
  items: T[],
  primaryProcessor: (item: T) => Promise<R>,
  fallbackProcessor: (item: T) => Promise<R>,
  options: BatchOptions = {}
): Promise<R[]> {
  const processor = async (item: T): Promise<R> => {
    try {
      return await primaryProcessor(item);
    } catch (error) {
      console.warn("Primary processor failed, trying fallback:", error);
      return await fallbackProcessor(item);
    }
  };

  return processBatch(items, processor, options);
}
