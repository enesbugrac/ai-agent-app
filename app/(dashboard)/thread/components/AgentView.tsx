'use client'

import PromptCard from "@/components/PromptCard";
import { prompts } from "@/data/prompts";
import { Agent, AgentData } from "@/types/agent.types";
import { motion, AnimatePresence } from "framer-motion";

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
                Use one of the most common prompts below or use your own to begin
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {prompts.map((prompt, index) => (
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