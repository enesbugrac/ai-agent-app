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
    <div className="bg-background-card rounded-xl border border-border p-4 hover:bg-background-overlay transition-all group">
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">{name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="text-primary font-medium mb-0.5">{name}</h3>
            <span className="text-xs text-secondary">{price}</span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full ${
            isPositive
              ? "bg-status-success-background text-status-success"
              : "bg-status-error-background text-status-error"
          }`}
        >
          <span className="text-sm font-medium">{percentage}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-background-highlight text-muted hover:text-primary transition-colors">
            <span>📊</span>
          </button>
          <button className="p-1.5 rounded-lg hover:bg-background-highlight text-muted hover:text-primary transition-colors">
            <span>💱</span>
          </button>
        </div>
        <button className="text-muted hover:text-primary">•••</button>
      </div>
    </div>
  );
};

export default TokenCard;
