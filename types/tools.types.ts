// Base ToolJson generic type
export type ToolJson<T> = {
    isUi: boolean; // Indicates if special UI rendering is required
    metadata: T;   // Tool-specific data
};



export type CheckWeatherMetadata = {
    type: 'check-weather';
    weatherInfo: {
        temperature: number;
        condition: string;
        humidity: number;
    };
    location: string;
    content?: string;
}

export type CheckWeatherTool = ToolJson<CheckWeatherMetadata>;


export type SwapCryptoMetadata = {
    type: 'swapCryptoToken';
    swapDetails: {
        amount: number;
        rate: number;
        fee: number;
    };
    fromToken: string;
    toToken: string;
    content?: string;
}

export type SwapCryptoTool = ToolJson<SwapCryptoMetadata>;


export type ExchangePriceInfo = {
    exchange: string;
    price: number;
    marketPair: string;
};

// Represents an opportunity identified by deviation from the average
export type ArbitrageOpportunity = {
    exchange: string;
    price: number;
    marketPair: string;
    differenceFromAveragePercentage: number;
};

// Represents the scan results for a single cryptocurrency
export type CryptoArbitrageResult = {
    cryptoSymbol: string;
    // cryptoName: string; // Name isn't directly available from this endpoint
    averagePrice: number | null;
    opportunities: ArbitrageOpportunity[];
    checkedExchangesCount: number;
    error?: string;
};

// Top-level metadata structure
export type ArbitrageScanMetadata = {
    type: "arbitrage-scan";
    results: CryptoArbitrageResult[];
};

export type ArbitrageScanTool = ToolJson<ArbitrageScanMetadata>;


export type PossibleToolJson = CheckWeatherTool | SwapCryptoTool | ArbitrageScanTool;