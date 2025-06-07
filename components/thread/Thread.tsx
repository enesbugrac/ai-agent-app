import { agents } from "@/data/agents";
import {
  useThreadMutation,
  useThreadQueryAsync,
} from "@/hooks/queries/thread.query";

import React, { useMemo } from "react";
import { useInput } from "@/hooks/input.hooks";
import ThreadView from "@/components/thread/ThreadView";
import { useAuthCache } from "@/hooks/auth.hooks";

import ChatInput from "./ChatInput";
import { useAuthStore } from "@/store/useStore"; // Import the store

function Thread({}) {

  const { user } = useAuthCache();
  const { decreaseCredit } = useAuthStore(); // Get the decreaseCredit function from the store
  const { thread, isLoading } = useThreadQueryAsync();

  const { addMessageToThreadAsync, isMessageWaiting } = useThreadMutation();

  const messages = thread?.messages;


  const handleSend = async (messageContent: string) => {
    // Check credits using the user object from useAuth (or potentially useAuthStore if preferred)
    if (!messageContent.trim() || !(user?.credits ?? 0 > 0)) return;

    // Decrease credit using the function from the store
    decreaseCredit();
    addMessageToThreadAsync(messageContent);
  };

  if (!isLoading && !thread) {
    return (
      <div className="flex flex-col h-screen bg-background">
        Thread not found
      </div>
    );
  }

  return (

      <>
        <ThreadView
          messages={messages ?? []}
          isMessageWaiting={isMessageWaiting}
        />

          <ChatInput
            onSend={handleSend}
            isSending={isMessageWaiting}
            placeholder="Ask whatever you want..."
          />
      </>

  );
}

export default Thread;
