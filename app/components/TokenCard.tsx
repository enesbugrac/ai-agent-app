import React from "react";
import Image from "next/image";

interface TokenCardProps {
  icon?: string;
  name: string;
  price: string;
  percentage: string;
  isPositive: boolean;
}

const TokenCard = ({ icon, name, price, percentage, isPositive }: TokenCardProps) => {
  return (
    <div className="bg-[#2C001E] rounded-xl border border-[#F3BA2F]/10 p-4 hover:bg-[#3C0029] transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <Image
              src={icon}
              alt={name}
              width={32}
              height={32}
              className="rounded-full group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F3BA2F] to-[#E95420] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">{name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="text-[#F3BA2F] font-medium mb-0.5">{name}</h3>
            <span className="text-xs text-[#888]">{price}</span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full ${
            isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          <span className="text-sm font-medium">{percentage}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-[#F3BA2F]/10 text-[#666] hover:text-[#F3BA2F] transition-colors">
            <span>📊</span>
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[#F3BA2F]/10 text-[#666] hover:text-[#F3BA2F] transition-colors">
            <span>💱</span>
          </button>
        </div>
        <button className="text-[#666] hover:text-[#F3BA2F]">•••</button>
      </div>
    </div>
  );
};

export default TokenCard;
