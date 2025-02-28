"use client";

interface Token {
  name: string;
  price: string;
  percentage: string;
  isPositive: boolean;
}

interface TokenCarouselProps {
  tokens: Token[];
}

export default function TokenCarousel({ tokens }: TokenCarouselProps) {
  // Duplicate tokens for seamless loop
  const displayTokens = [...tokens, ...tokens, ...tokens];

  return (
    <div className="relative overflow-hidden flex-1 mask-edges">
      <div className="flex whitespace-nowrap animate-scroll">
        {displayTokens.map((token, index) => (
          <div
            key={`${token.name}-${index}`}
            className="inline-flex items-center gap-2 px-4 py-1 text-xs font-medium group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[#F3BA2F] group-hover:text-[#F3BA2F]/80 transition-colors">
                {token.name}
              </span>
              <span className="text-[#666]">/</span>
              <span className="text-[#888]">USDT</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                token.isPositive
                  ? "text-black bg-[#F3BA2F]/90 group-hover:bg-[#F3BA2F]"
                  : "text-[#F3BA2F] bg-[#F3BA2F]/10 group-hover:bg-[#F3BA2F]/20"
              } transition-colors`}
            >
              {token.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
