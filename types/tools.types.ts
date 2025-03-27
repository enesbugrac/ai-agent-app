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


export type PossibleToolJson = CheckWeatherTool | SwapCryptoTool;