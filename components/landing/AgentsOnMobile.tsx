import React from "react";
import { landingAgents } from "@/data/agents";
import AgentCard from "../AgentCard";

const AgentsOnMobile = () => {
  return (
    <section className="flex flex-col gap-4 px-6 pb-6 md:pb-0 md:px-0">
      <h2 className="text-4xl md:text-9xl font-bold text-white font-syne">
        Agents
      </h2>
      {landingAgents.map((agent, index) => (
        <div key={index} className={`animate__animated ${index % 2 === 0 ? "animate__fadeInLeft" : "animate__fadeInRight"}`}>
          <AgentCard
            description={agent.description}
            id={agent.id}
            name={agent.name}
            type={agent.type}
            logo={agent.logo}
            clickable={false}
          />
        </div>
      ))}
    </section>
  );
};

export default AgentsOnMobile;
