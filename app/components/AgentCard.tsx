import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaEllipsisH,
  FaChartLine,
  FaExchangeAlt,
  FaHeart,
} from "react-icons/fa";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: IconType;
}

export default function AgentCard({ id, name, description, type, icon: Icon }: AgentCardProps) {
  return (
    <Link href={`/chat/${id}`} className="block group h-[200px]">
      <div className="bg-background-overlay rounded-lg overflow-hidden border border-border shadow-lg backdrop-blur-sm h-full hover:border-primary/20 transition-[border-color]">
        {/* Ubuntu Window Header */}
        <div className="bg-background-card px-3 py-2 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Icon className="text-[10px] text-white opacity-0 group-hover:opacity-100" />
            </div>
            <div className="w-4 h-4 rounded-full bg-primary/30"></div>
            <div className="w-4 h-4 rounded-full bg-primary/10"></div>
          </div>
          <span className="text-secondary text-xs">
            {name} - {type}
          </span>
          <div className="flex gap-1">
            <button className="text-secondary hover:text-primary">
              <FaEllipsisH className="text-xs" />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-primary p-[1px]">
              <div className="w-full h-full rounded bg-background flex items-center justify-center">
                <Icon className="text-lg text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-primary text-sm font-medium">{name}</h3>
              <p className="text-secondary text-xs">{type}</p>
            </div>
          </div>
          <p className="text-secondary text-xs leading-relaxed flex-1 min-h-[40px]">
            {description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-primary/5 text-secondary hover:text-primary">
                <FaChartLine className="text-xs" />
              </button>
              <button className="p-1.5 rounded hover:bg-primary/5 text-secondary hover:text-primary">
                <FaExchangeAlt className="text-xs" />
              </button>
            </div>
            <button className="p-1.5 rounded hover:bg-primary/5 text-secondary hover:text-primary">
              <FaHeart className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
