import React from 'react';
import { SwapCryptoMetadata } from '../../../types/aiResponse.type';

const SwapCryptoUI: React.FC<{ toolData: SwapCryptoMetadata }> = ({ toolData }) => {
    return (
      <div className="swap-crypto-ui bg-slate-800 p-4 rounded-lg border border-slate-700 my-2 w-full max-w-md">
        <h4 className="text-lg font-medium text-white mb-2">Kripto Token Değişimi</h4>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-primary">{toolData.fromToken}</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="text-xl font-semibold text-primary">{toolData.toToken}</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Miktar:</span>
            <span className="text-white">{toolData.swapDetails.amount} {toolData.fromToken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kur:</span>
            <span className="text-white">1 {toolData.fromToken} = {toolData.swapDetails.rate} {toolData.toToken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">İşlem Ücreti:</span>
            <span className="text-white">{toolData.swapDetails.fee} {toolData.fromToken}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-700 mt-2">
            <span className="text-gray-400">Toplam Alınan:</span>
            <span className="text-green-400 font-medium">
              {(toolData.swapDetails.amount * toolData.swapDetails.rate).toFixed(2)} {toolData.toToken}
            </span>
          </div>
        </div>
      </div>
    );
  };

export default SwapCryptoUI;