import React from 'react';
import CheckWeatherUI from './agentUi/CheckWeatherUI';
import SwapCryptoUI from './agentUi/SwapCryptoUI';
import { AIMessageProps, CheckWeatherMetadata, SwapCryptoMetadata } from '../../types/aiResponse.type';

const AIMessage: React.FC<AIMessageProps> = ({ response }) => {
  const { content, toolJson } = response;

  const renderAgentUi = () => {
    if (!toolJson) return null;
    
    const toolData = toolJson.toolData;
    const toolType = toolData.type;
    
    switch (toolType) {
      case "checkWeather":
        return <CheckWeatherUI toolData={toolData as CheckWeatherMetadata} />;
      case "swapCryptoToken":
        return <SwapCryptoUI toolData={toolData as SwapCryptoMetadata} />;
    }
  };

  return (
    <div className="message-component bg-background-overlay rounded-lg p-6 border border-border w-full max-w-xl">
      <div className="flex items-center mb-4">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">A</div>
        <span className="ml-3 text-white font-medium">AI Agent</span>
      </div>

      <p className="text-secondary mb-4">{content}</p>

      {toolJson?.isUi && (
        <div className="ai-agent-tool-ui mt-2">
            {renderAgentUi()}
        </div>
      )}
      {toolJson?.content && !toolJson.isUi && (
        <div className="ai-agent-tool-ui mt-2 p-3 bg-slate-800 rounded text-gray-400 text-sm">
          <p>{toolJson.content}</p>
        </div>
      )}
    </div>
  );
};

export default AIMessage;
