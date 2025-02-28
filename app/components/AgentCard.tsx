import { IconType } from "react-icons";
import {
  FaStore,
  FaHeart,
  FaEllipsisH,
  FaChartLine,
  FaExchangeAlt,
} from "react-icons/fa";

interface AgentCardProps {
  name: string;
  description: string;
  type: string;
  icon: IconType;
}

export default function AgentCard({
  name,
  description,
  type,
  icon: Icon,
}: AgentCardProps) {
  return (
    <div className="group h-[200px]">
      <div className="bg-black/50 rounded-lg overflow-hidden border border-[#F3BA2F]/10 shadow-lg backdrop-blur-sm">
        {/* Ubuntu Window Header */}
        <div className="bg-black/90 px-3 py-2 flex items-center justify-between border-b border-[#F3BA2F]/10">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#F3BA2F] flex items-center justify-center">
              <Icon className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#F3BA2F]/30"></div>
            <div className="w-4 h-4 rounded-full bg-[#F3BA2F]/10"></div>
          </div>
          <span className="text-[#888] text-xs">
            {name} - {type}
          </span>
          <div className="flex gap-1">
            <button className="text-[#888] hover:text-[#F3BA2F] transition-colors">
              <FaEllipsisH className="text-xs" />
            </button>
          </div>
        </div>
        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-[#F3BA2F] p-[1px]">
              <div className="w-full h-full rounded bg-black flex items-center justify-center">
                <Icon className="text-lg text-[#F3BA2F]" />
              </div>
            </div>
            <div>
              <h3 className="text-[#F3BA2F] text-sm font-medium">{name}</h3>
              <p className="text-[#888] text-xs">{type}</p>
            </div>
          </div>
          <p className="text-[#888] text-xs leading-relaxed flex-1 min-h-[40px]">
            {description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-[#F3BA2F]/10">
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-[#F3BA2F]/10 text-[#888] hover:text-[#F3BA2F] transition-all">
                <FaChartLine className="text-xs" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#F3BA2F]/10 text-[#888] hover:text-[#F3BA2F] transition-all">
                <FaExchangeAlt className="text-xs" />
              </button>
            </div>
            <button className="p-1.5 rounded hover:bg-[#F3BA2F]/10 text-[#888] hover:text-[#F3BA2F] transition-all">
              <FaHeart className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
