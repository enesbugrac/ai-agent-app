import React, { useState } from "react";
import { motion } from "framer-motion";

import { useThreadMutation } from "@/hooks/queries/thread.query";

import { useRouter } from "next/navigation";
import ThreadView from "@/components/thread/ThreadView";
import { useAuthCache } from "@/hooks/auth.hooks";
import { usePrivy } from "@privy-io/react-auth";
import ChatInput from "./ChatInput";
import { useAuthStore } from "@/store/useStore";
import { AgentData } from "@/data/agents";
import AgentView from "../AgentView";

type Props = {
  agentData: AgentData;
};

function ThreadStarter({ agentData }: Props) {
  const { login } = usePrivy();
  const { user } = useAuthCache();
  const { decreaseCredit } = useAuthStore();
  const { createThreadAsync, isThreadCreating, initialMessage } = useThreadMutation();
  const [welcomeMessageDisappear, setWelcomeMessageDisappear] = useState(false);
  const [animateChatInputDown, setAnimateChatInputDown] = useState(false);
  const router = useRouter();

  const addNewThread = async (messageContent: string) => {
    if (!user) {
      login();
      return;
    }
    if (!messageContent.trim() || !(user?.credits ?? 0 > 0)) return;

    setWelcomeMessageDisappear(true);
    setAnimateChatInputDown(true);

    decreaseCredit();

    try {
      const thread = await createThreadAsync(messageContent, agentData.id);
      router.replace(`/thread/${thread._id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  return (
    <>
      <AgentView
        agent={agentData}
        onPromptClick={addNewThread}
        welcomeMessageDissapear={welcomeMessageDisappear}
      />

      {initialMessage && (
        <ThreadView
          messages={initialMessage ? [initialMessage] : []}
          isMessageWaiting={true}
        />
      )}

      <motion.div
        className="w-full"
        initial={{ y: "-18vh", opacity: 1 }}
        animate={{
          y: animateChatInputDown ? 0 : "-18vh",
          opacity: 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ChatInput
          onSend={addNewThread}
          isSending={isThreadCreating}
          placeholder="Ask whatever you want..."
        />
      </motion.div>
    </>
  );
}

export default ThreadStarter;
