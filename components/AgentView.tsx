'use client'

import PromptCard from "@/components/PromptCard";
import { AgentData } from "@/data/agents";
import { agentPrompts, generalPrompts } from "@/data/prompts";

interface AgentViewProps {
  agent: AgentData;
  onPromptClick: (text: string) => void;
  welcomeMessageDissapear: boolean;
}

export default function AgentView({
  agent,
  onPromptClick,
  welcomeMessageDissapear,
}: AgentViewProps) {
  // Get agent-specific prompts or fall back to general prompts if none exist
  const currentPrompts = agent?.id ? agentPrompts[agent.id] || generalPrompts : generalPrompts;

  return (

    <>
      {!welcomeMessageDissapear && (
        <div className="flex flex-col items-center flex-grow justify-center w-full">
          <div
            key="agent-welcome-content "
            className="w-full max-w-3xl"

          >
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-medium mb-2">
                Hello! I&apos;m, <span className="text-tertiary">{agent?.name}</span>
              </h1>
              <h1 className="text-4xl text-primary">How can I assist you today?</h1>
              <p className="text-secondary text-sm mt-2">
                Use one of the suggested prompts below or type your own question to begin
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {currentPrompts.map((prompt, index) => (
                <PromptCard
                  key={index}
                  icon={prompt.icon}
                  text={prompt.text}
                  onClick={() => onPromptClick(prompt.text)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>

  );
}