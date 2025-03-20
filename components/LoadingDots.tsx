'use client';

export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-secondary animate-[bounce_1s_infinite] [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-secondary animate-[bounce_1s_infinite] [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-secondary animate-[bounce_1s_infinite]"></div>
    </div>
  );
} 