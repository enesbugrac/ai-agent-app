import React from 'react';
import { Agent, AgentData } from '@/types/agent.types';
import { useAuthStore } from '@/store/useStore';

type ThreadHeaderProps = {
  agent: AgentData | undefined;
};

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ agent }) => {
  if (!agent) {

    return (
      <div className="z-10 h-16 w-full bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
        <div>Loading Agent...</div>
      </div>
    );
  }

  return (
    <div className="z-10 h-16 w-full  border-b border-border  pl-6 pr-[10%] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary p-[1px]">
          <div className="w-full h-full rounded bg-background flex items-center justify-center">
            {agent && <agent.icon className="text-lg text-primary" />}
          </div>
        </div>
        <div>
          <h1 className="text-primary font-medium text-sm">{agent.name}</h1>
          <span className="text-secondary text-xs">{agent.type}</span>
        </div>
      </div>
    </div>
  );
};

export default ThreadHeader;
