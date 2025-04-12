import { agents } from "@/data/agents";
import {
  useThreadMutation,
  useThreadQueryAsync,
} from "@/hooks/queries/thread.query";

import React, { useMemo } from "react";
import { useInput } from "@/hooks/input.hooks";
import ThreadView from "@/components/thread/ThreadView";
import { useAuthCache } from "@/hooks/auth.hooks";

import ThreadHeader from "./ThreadHeader";
import ChatInput from "./ChatInput";
import { useAuthStore } from "@/store/useStore"; // Import the store

function Thread({ }) {
  const { input, setInput } = useInput();
  const { user } = useAuthCache();
  const { decreaseCredit } = useAuthStore(); // Get the decreaseCredit function from the store
  const { thread, isLoading } = useThreadQueryAsync();

  const { addMessageToThreadAsync, isMessageWaiting } = useThreadMutation();

  const messages = thread?.messages;


  // TODO: agents and assitances should be fetched from BE and stored on zuztang
  // Find from zuztang
  const agent = useMemo(() => {
    return agents.find((a) => a.id === thread?.agent);
  }, [thread]);

  const handleSend = async (messageContent: string) => {
    // Check credits using the user object from useAuth (or potentially useAuthStore if preferred)
    if (!messageContent.trim() || !(user?.credits ?? 0 > 0)) return;

    // Decrease credit using the function from the store
    decreaseCredit();

    setInput("");
    addMessageToThreadAsync(messageContent);
  };



  if (!isLoading && !thread) {
    return <div className="flex flex-col h-screen bg-background">Thread not found</div>;
  }



  return (
    <div className="flex flex-col h-screen bg-background">
      <ThreadHeader agent={agent} />

      <div
        className={`flex-1 flex flex-col w-[70%] mx-auto justify-between py-4 gap-4 h-[calc(100vh-4rem)] overflow-hidden`}
      >

        <>
          <ThreadView
            messages={messages ?? []}
            isMessageWaiting={isMessageWaiting}
          />

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend(input)}
            isSending={isMessageWaiting}
            placeholder="Ask whatever you want..."
          />
        </>


      </div>
    </div>
  );
}

export default Thread;
