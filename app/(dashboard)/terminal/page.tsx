"use client";

import { usePrivy } from "@privy-io/react-auth";
import { FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import TokenCarousel from "@/components/TokenCarousel";
import { agents } from "@/data/agents";
import { tokens } from "@/data/tokens";
import AgentCard from "@/components/AgentCard";

export default function Home() {
  const { login, authenticated } = usePrivy();
  const featuredAgents = agents.slice(0, 3); // Show first 2 agents on home page

  return (
    <div className="h-screen w-[calc(100vw-260px)] overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="h-16 bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1 overflow-hidden">
          <h1 className="text-primary font-medium text-sm shrink-0">Overview</h1>
          <div className="overflow-hidden">
            <TokenCarousel tokens={tokens} />
          </div>
        </div>
        <div className="shrink-0">
          {!authenticated ? (
            <button
              onClick={login}
              className="bg-primary text-background px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Connect Wallet
            </button>
          ) : (
            <button className="text-secondary hover:text-primary text-xs transition-colors flex items-center gap-1">
              View Markets
              <span className="text-lg">→</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Welcome Section */}
          <div className="flex flex-col items-center gap-8 py-12 w-full">
            <div className="text-4xl font-medium text-white text-center">
              Welcome to <span className="text-tertiary font-markpro">AIGEN</span>
            </div>

            {/* Input Container */}
            <div className="w-full max-w-2xl">
              <div className="bg-[#1A1D23] backdrop-blur-sm rounded-2xl p-0.5 border border-border">
                <div className="flex items-center p-3">
                  <input
                    type="text"
                    placeholder="Message Aigen..."
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-secondary placeholder-text-muted text-sm"
                  />
                  <button className="shrink-0 bg-primary text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
                    <IoAddCircleOutline className="text-base" />
                    Add Energy
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 text-secondary text-xs space-y-1 opacity-80">
                <p>Aigen is learning how to delegate you to the right agent</p>
                <p>@ the right agent if you&apos;re led astray</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <button className="shrink-0 flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all text-xs font-medium text-black">
                <FaMapMarkerAlt className="text-sm" />
                Featured
              </button>
              <button className="shrink-0 flex items-center gap-2 text-secondary hover:text-primary px-3 py-1.5 rounded-lg hover:bg-background-highlight transition-all text-xs">
                <FaUserFriends className="text-sm" />
                My Agents
              </button>
            </div>
            <div className="text-xs text-primary/50">3 agents available</div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
            {featuredAgents.map((agent) => (
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
