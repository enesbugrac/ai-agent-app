import React from 'react';
import { ArbitrageScanMetadata } from '@/types/tools.types';
import { FaExchangeAlt, FaChartLine } from 'react-icons/fa';

interface ArbitrageScanUIProps {
  toolData: ArbitrageScanMetadata;
}

const ArbitrageScanUI: React.FC<ArbitrageScanUIProps> = ({ toolData }) => {
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Determine text color based on percentage value
  const getPercentageColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (

      <div className="w-full  bg-[#1A1D23] backdrop-blur-sm p-4 rounded-lg border border-border mb-4">
        <div className="hidden md:flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-white flex items-center gap-2">
            <FaChartLine className="text-primary" />
            Arbitrage Opportunities
          </h3>
          <span className="text-xs bg-primary px-2 py-1 rounded text-black">
            {toolData.results.length} currencies scanned
          </span>
        </div>
        
        {toolData.results.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No arbitrage opportunities found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {toolData.results.map((result, index) => (
              <div key={index} className="border-t border-slate-700 pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium text-md">{result.cryptoSymbol}</h4>
                    <p className="text-xs text-gray-400">
                      Avg. Price: {result.averagePrice ? formatCurrency(result.averagePrice) : 'N/A'}
                    </p>
                  </div>
                  <span className="text-xs bg-primary px-2 py-1 rounded text-black">
                    {result.checkedExchangesCount} exchanges
                  </span>
                </div>
                
                {result.error ? (
                  <p className="text-red-400 text-sm">{result.error}</p>
                ) : result.opportunities.length === 0 ? (
                  <p className="text-gray-400 text-sm">No significant price differences</p>
                ) : (
                  <div className="bg-[#1A1D23] rounded overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/80">
                          <th className="text-left p-2 text-xs text-gray-400 font-normal">Exchange</th>
                          <th className="text-right p-2 text-xs text-gray-400 font-normal">Price</th>
                          <th className="text-right p-2 text-xs text-gray-400 font-normal">Diff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.opportunities
                          .sort((a, b) => Math.abs(b.differenceFromAveragePercentage) - Math.abs(a.differenceFromAveragePercentage))
                          .map((opportunity, opIndex) => (
                            <tr 
                              key={opIndex} 
                              className={`border-b border-border/80 last:border-b-0 ${
                                Math.abs(opportunity.differenceFromAveragePercentage) > 3 
                                  ? 'bg-slate-800/50' 
                                  : ''
                              }`}
                            >
                              <td className="p-2 flex items-center gap-1">
                                <FaExchangeAlt className="text-xs text-gray-500" />
                                <span className="text-white text-sm">{opportunity.exchange}</span>
                              </td>
                              <td className="p-2 text-right text-white text-sm">
                                {formatCurrency(opportunity.price)}
                              </td>
                              <td className={`p-2 text-right font-medium text-sm ${getPercentageColor(opportunity.differenceFromAveragePercentage)}`}>
                                {formatPercentage(opportunity.differenceFromAveragePercentage)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

  );
};

export default ArbitrageScanUI;
