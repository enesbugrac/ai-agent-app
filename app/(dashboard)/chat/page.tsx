"use client";

import { useParams, notFound } from "next/navigation";
import { FaEllipsisH, FaCog } from "react-icons/fa";
import { agents } from "@/data/agents";

export default function ChatPage() {
  const params = useParams();
  const agent = agents.find((a) => a.id === params.id);

  if (!agent) {
    notFound();
  }

  // Update the header to use the agent info
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="h-16 bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary p-[1px]">
            <div className="w-full h-full rounded bg-background flex items-center justify-center">
              {agent && <agent.icon className="text-lg text-primary" />}
            </div>
          </div>
          <div>
            <h1 className="text-primary font-medium text-sm">{agent?.name}</h1>
            <span className="text-secondary text-xs">{agent?.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-primary/5 text-secondary hover:text-primary">
            <FaCog className="text-sm" />
          </button>
          <button className="p-2 rounded-lg hover:bg-primary/5 text-secondary hover:text-primary">
            <FaEllipsisH className="text-sm" />
          </button>
        </div>
      </div>

      {/* Rest of your chat component remains the same */}
      {/* Just update the colors to use the new theme variables */}
    </div>
  );
}
