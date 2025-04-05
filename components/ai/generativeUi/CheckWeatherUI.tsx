import React from 'react';
import { CheckWeatherMetadata } from '@/types/tools.types';

const CheckWeatherUI: React.FC<{ toolData: CheckWeatherMetadata }> = ({ toolData }) => {
  // Function to determine weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return '☀️';
    } else if (lowerCondition.includes('cloud')) {
      return '☁️';
    } else if (lowerCondition.includes('rain')) {
      return '🌧️';
    } else if (lowerCondition.includes('snow')) {
      return '❄️';
    } else if (lowerCondition.includes('thunder')) {
      return '⚡';
    } else {
      return '🌤️';
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 my-2 w-full max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-medium text-white">Hava Durumu: {toolData.location}</h4>
        <span className="text-3xl">{getWeatherIcon(toolData.weatherInfo.condition)}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-white">{toolData.weatherInfo.temperature}°C</span>
          <span className="text-gray-400">{toolData.weatherInfo.condition}</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end">
            <span className="text-blue-400 mr-1">💧</span>
            <span className="text-gray-300">{toolData.weatherInfo.humidity}% Nem</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckWeatherUI;
