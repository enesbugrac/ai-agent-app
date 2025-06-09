"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { agents } from "@/data/agents";
import AgentCard from "@/components/AgentCard";

export default function Home() {
  const featuredAgents = agents.slice(0, 1); // Show first 2 agents on home page

  return (
    <>
      <div className="w-full h-full md:px-4 md:py-10">
        {/* <div className="shrink-0">
          {!authenticated && (
            <button
              onClick={login}
              className="bg-primary text-background px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Connect Wallet
            </button>
          )}
        </div> */}

        <div className="flex flex-col items-center gap-8 pt-[1rem] md:pt-12 lg:pt-28 w-full">
          <div className="md:text-6xl text-4xl font-bold text-white text-center line-clamp-1">
            Welcome to <span className="text-tertiary font-markpro">AIGEN</span>
          </div>

          <div className="hidden sm:block text-center mt-4 text-secondary text-md space-y-1 opacity-80">
            <p>Aigen is learning how to delegate you to the right agent</p>
            <p>@ the right agent if you&apos;re led astray</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
          <div className="flex gap-3 flex-wrap">
            <button className="shrink-0 flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all text-xs font-medium text-black">
              <FaMapMarkerAlt className="text-sm" />
              Featured
            </button>
            {/* <button className="shrink-0 flex items-center gap-2 text-secondary hover:text-primary px-3 py-1.5 rounded-lg hover:bg-background-highlight transition-all text-xs">
                <FaUserFriends className="text-sm" />
                My Agents
              </button> */}
          </div>
          <div className="text-xs text-primary/50">1 agents available</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pb-8 w-full overflow-y-scroll h-fit">
          {featuredAgents.map((agent) => (
            <AgentCard
              key={agent.name}
              id={agent.id}
              name={agent.name}
              subTitle={agent.subTitle}
              description={agent.description}
              type={agent.type}
              logo={agent.logo}
              actions={agent.actions}
            />
          ))}
        </div>
      </div>
    </>
  );
}
