import { IoSparkles } from "react-icons/io5";
import AgentCard from "@/components/AgentCard";
import { agents } from "@/data/agents";

export default function SpecialAgents() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Bar */}
      <div className="h-16 bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center">
        <div className="flex items-center gap-2">
          <IoSparkles className="text-primary text-lg" />
          <h1 className="text-primary font-medium">Special Agents</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">
                Discover Special Agents
              </h2>
              <p className="text-secondary">
                Enhance your experience with our specialized AI agents
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-secondary">
                <span className="text-primary font-medium">{agents.length}</span> agents
                available
              </div>
              <button className="bg-[#1A1D23] text-primary px-4 py-2 rounded-lg text-sm hover:bg-[#1A1D23]/80 transition-all border border-border">
                Create Agent
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 p-4 bg-[#1A1D23] rounded-xl border border-border">
            <input
              type="text"
              placeholder="Search agents..."
              className="flex-1 bg-transparent border-none outline-none text-secondary placeholder-text-muted text-sm"
            />
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              Filter
            </button>
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              Sort
            </button>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.displayId}
                id={agent.displayId}
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
