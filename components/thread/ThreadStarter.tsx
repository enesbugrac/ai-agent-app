import AgentView from "@/app/(dashboard)/thread/components/AgentView";
import { useInput } from "@/hooks/input.hooks";
import { useThreadMutation } from "@/hooks/queries/thread.query";
import { Agent } from "@/types/agent.types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import ThreadView from "@/app/(dashboard)/thread/components/ThreadView";
import { useAuthCache } from "@/hooks/auth.hooks";
import { usePrivy } from "@privy-io/react-auth";
import ThreadHeader from "./ThreadHeader";
import ChatInput from "./ChatInput";
import { useAuthStore } from "@/store/useStore"; // Import the store

type Props = {
  agent: Agent;
};

function ThreadStarter({ agent }: Props) {
  const { input, setInput } = useInput();
  const { login } = usePrivy();
  const { user } = useAuthCache();
  const { decreaseCredit } = useAuthStore(); // Get decreaseCredit from store
  const { createThreadAsync, isThreadCreating, initialMessage } =
    useThreadMutation();
  const [welcomeMessageDisappear, setWelcomeMessageDisappear] = useState(false);
  const router = useRouter();
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const addNewThread = async (messageContent: string) => {
    if (!user) {
      login();
      return;
    }
    // Check credits before proceeding
    if (!messageContent.trim() || !(user?.credits ?? 0 > 0)) return;

    setWelcomeMessageDisappear(true);

    if (inputContainerRef.current) {
      inputContainerRef.current.style.transform = "translateY(100%)";

    }


    // Decrease credit before creating thread
    decreaseCredit();

    try {
      const thread = await createThreadAsync(messageContent, agent.id);
      router.replace(`/thread/${thread._id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ThreadHeader agent={agent} />

      <div
        className={`flex-1 flex flex-col w-[70%] mx-auto  justify-center
                     py-4 gap-4 h-[calc(100vh-4rem)] overflow-hidden`}
      >
        <AgentView
          agent={agent!}
          onPromptClick={addNewThread}
          welcomeMessageDissapear={welcomeMessageDisappear}
        />

        {isThreadCreating && (
          <ThreadView
            messages={initialMessage ? [initialMessage] : []}
            isMessageWaiting={true}
          />
        )}
        <ChatInput
          inputContainerRef={inputContainerRef}
          value={input}
          onChange={setInput}
          onSend={() => addNewThread(input)}
          isSending={isThreadCreating}
          placeholder="Ask whatever you want..."
        />
      </div>
    </div>
  );
}

export default ThreadStarter;
