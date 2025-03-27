// Base ToolJson generic type
export interface ToolJson<T> {
  isUi: boolean;
  content: string;
  toolData: T;
}


export type CheckWeatherMetadata = {
  type: 'checkWeather';
  weatherInfo: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  location: string;
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
}

export type SwapCryptoTool = ToolJson<SwapCryptoMetadata>;


export type Tool = CheckWeatherTool | SwapCryptoTool;


export interface AiResponse {
  content: string;
  toolJson?: Tool;
}

export interface AIMessageProps {
  response: AiResponse;
}