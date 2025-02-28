import { FaStore, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import TokenCarousel from "./components/TokenCarousel";
import AgentCard from "./components/AgentCard";

const tokens = [
  { name: "500000", price: "43.67%", percentage: "+177.41%", isPositive: true },
  { name: "Y2Y", price: "177.41%", percentage: "+22.23%", isPositive: true },
  { name: "EKKO", price: "22.23%", percentage: "-2.44%", isPositive: false },
  { name: "JUP", price: "-2.44%", percentage: "-5.11%", isPositive: false },
  { name: "arc", price: "-5.11%", percentage: "+39.46%", isPositive: true },
  { name: "MWM", price: "39.46%", percentage: "+11.0%", isPositive: true },
];

const agents = [
  {
    name: "Kitsune",
    description: "Shop hundreds of everyday products right onchain with Kitsune.",
    type: "AI Trading Bot",
    icon: FaStore,
  },
  {
    name: "Sniper",
    description: "Snipe new tokens on pump.fun",
    type: "Token Sniper",
    icon: FaUserFriends,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Top Bar */}
      <div className="bg-black/50 border-b border-[#F3BA2F]/10 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1 overflow-hidden">
          <h1 className="text-[#F3BA2F] font-medium text-sm">Overview</h1>
          <TokenCarousel tokens={tokens} />
        </div>
        <button className="text-[#888] hover:text-[#F3BA2F] text-xs transition-colors flex items-center gap-1">
          View Markets
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col items-center gap-8 py-12">
            <div className="text-4xl font-medium text-white">
              Welcome to <span className="text-[#F3BA2F]">Griffain</span>
            </div>
            <div className="w-full max-w-2xl">
              <div className="bg-[#F3BA2F]/5 backdrop-blur-sm rounded-2xl p-1 border border-[#F3BA2F]/10">
                <div className="bg-black/50 rounded-xl">
                  <div className="flex items-center p-3">
                    <input
                      type="text"
                      placeholder="Message Griffain..."
                      className="flex-1 bg-transparent border-none outline-none text-[#888] placeholder-[#666] text-sm"
                    />
                    <button className="bg-[#F3BA2F] text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#F3BA2F]/90 transition-all flex items-center gap-2">
                      <IoAddCircleOutline className="text-base" />
                      Add Energy
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 text-[#888] text-xs space-y-1 opacity-80">
                <p>Griffain is learning how to delegate you to the right agent</p>
                <p>@ the right agent if you&apos;re led astray</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-[#F3BA2F] text-black px-3 py-1.5 rounded-lg hover:bg-[#F3BA2F]/90 transition-all text-xs font-medium">
                <FaMapMarkerAlt className="text-sm" />
                Featured
              </button>
              <button className="flex items-center gap-2 text-[#888] hover:text-[#F3BA2F] px-3 py-1.5 rounded-lg hover:bg-[#F3BA2F]/10 transition-all text-xs">
                <FaUserFriends className="text-sm" />
                My Agents
              </button>
            </div>
            <div className="text-xs text-[#F3BA2F]/50">3 agents available</div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.name}
                name={agent.name}
                description={agent.description}
                type={agent.type}
                icon={agent.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
