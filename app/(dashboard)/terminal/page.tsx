"use client";

import { usePrivy } from "@privy-io/react-auth";
import { FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { agents } from "@/data/agents";
import AgentCard from "@/components/AgentCard";
import PreditNextCandle from "@/components/ai/generativeUi/PreditNextCandle";

export default function Home() {
  const { login, authenticated } = usePrivy();
  const featuredAgents = agents.slice(0, 3); // Show first 2 agents on home page
  const mockKlines = [
    // 12 gerçek mum
    { time: 1680000000, open: 60000, high: 60500, low: 59500, close: 60200 },
    // ...
  ];

  const mockPredicted = [
    { time: 1680014400, open: 60200, high: 61000, low: 60000, close: 60800 },
    { time: 1680028800, open: 60800, high: 61500, low: 60700, close: 61000 },
  ];

  const initialData = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

  return (
    <>
      <div className="w-full h-full">
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
        {/* <div className="">
          <div className="flex flex-col items-center gap-8 pt-12 lg:pt-28 w-full">
            <div className="text-6xl font-bold text-white text-center line-clamp-1">
              Welcome to <span className="text-tertiary font-markpro">AIGEN</span>
            </div>


              <div className="hidden sm:block text-center mt-4 text-secondary text-md space-y-1 opacity-80">
                <p>Aigen is learning how to delegate you to the right agent</p>
                <p>@ the right agent if you&apos;re led astray</p>
              </div>

          </div>

          <div className="hidden sm:flex items-center justify-between gap-4 flex-wrap mt-4">
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

          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
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
        </div> */}
        <PreditNextCandle data={initialData}></PreditNextCandle>
      </div>
    </>
  );
}
