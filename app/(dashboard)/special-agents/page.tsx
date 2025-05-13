import { IoSparkles } from "react-icons/io5";
import AgentCard from "@/components/AgentCard";
import { agents } from "@/data/agents";
import PageHeader from "@/components/page/PageHeader";
import PageBody from "@/components/page/PageBody";
import Page from "@/components/page/Page";

export default function SpecialAgents() {
  return (
  <Page>
      <PageHeader
        icon={<IoSparkles className="text-primary text-lg" />}
        title="Special Agents"
      />

      {/* Main Content */}
      <PageBody className="gap-4">
        <div className="w-full flex items-center justify-between">
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
              <span className="text-primary font-medium">{agents.length}</span>{" "}
              agents available
            </div>
            <button disabled className="bg-[#1A1D23]  disabled:opacity-50 text-primary px-4 py-2 rounded-lg text-sm hover:bg-[#1A1D23]/80 transition-all border border-border">
              Create Agent
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="w-full flex items-center gap-4 p-4 bg-[#1A1D23] rounded-xl border border-border">
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              id={agent.id}
              name={agent.name}
              description={agent.description}
              type={agent.type}
              logo={agent.logo}
            />
          ))}
        </div>
      </PageBody>
    </Page>
  );
}
