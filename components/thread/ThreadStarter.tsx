import AgentView from "@/app/(dashboard)/thread/components/AgentView";
import { FaImage } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { useInput } from "@/hooks/input.hooks";
import { useThreadMutation } from "@/hooks/queries/thread.query";
import { Agent } from "@/types/agent.types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaCog, FaEllipsisH } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import ThreadView from "@/app/(dashboard)/thread/components/ThreadView";
import { useModalStore } from "@/store/modalStore";
import { useAuth } from "@/hooks/auth.hooks";
import { usePrivy } from "@privy-io/react-auth";

type Props = {
  agent: Agent;
};

function ThreadStarter({ agent }: Props) {
  const { input, setInput } = useInput();
  const { login } = usePrivy();
  const { user } = useAuth();
  const { createThreadAsync, isThreadCreating, initialMessage } =
    useThreadMutation();
  const [welcomeMessageDisappear, setWelcomeMessageDisappear] = useState(false);
  const router = useRouter();
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModalStore();

  const addNewThread = async (messageContent: string) => {
    if (!user) {
      login();
      return;
    }
    if (!messageContent.trim()) return;

    setWelcomeMessageDisappear(true);

    if (inputContainerRef.current) {
      inputContainerRef.current.style.transform = "translateY(100%)";
      setTimeout(() => {
        if (inputContainerRef.current) {
          inputContainerRef.current.classList.add(
            "animate__animated",
            "animate__slideInUp"
          );
          inputContainerRef.current.style.transform = "";
        }
      }, 100);
    }

    try {
      const thread = await createThreadAsync(messageContent, agent.id);
      router.replace(`/thread/${thread._id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
      // Hata durumunda kullanıcıya bilgi ver
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="z-50 h-16 w-full bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
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

        <div
          ref={inputContainerRef}
          className="flex flex-col bg-[#1A1D23] rounded-2xl shadow-sm w-full transition-transform duration-300"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addNewThread(input);
              }
            }}
            placeholder="Ask whatever you want..."
            className="w-full bg-transparent border-none outline-none text-secondary placeholder-text-muted text-sm px-4 pt-4 pb-2 resize-none min-h-[60px]"
            rows={5}
          />
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-3">
              <button className="text-secondary hover:text-primary flex items-center gap-2 text-xs">
                <FaPaperclip className="text-sm" />
                Add Attachment
              </button>
              <button className="text-secondary hover:text-primary flex items-center gap-2 text-xs">
                <FaImage className="text-sm" />
                Use Image
              </button>
            </div>
            <button
              onClick={() => addNewThread(input)}
              className="w-8 h-8 rounded-lg bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center"
            >
              <IoSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadStarter;
