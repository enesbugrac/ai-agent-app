import { agents } from "@/data/agents";
import { FaImage } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { useThreadMutation, useThreadQuery } from "@/hooks/queries/thread.query";

import React, { useMemo } from "react";
import { FaCog, FaEllipsisH } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useInput } from "@/hooks/input.hooks";
import ThreadView from "@/app/(dashboard)/thread/components/ThreadView";
import { useAuth } from "@/hooks/auth.hooks";

function Thread({}) {
  const { input, setInput } = useInput();
  const { user } = useAuth();
  const { thread, isLoading } = useThreadQuery();

  const { addMessageToThreadAsync, isMessageWaiting } = useThreadMutation();

  const messages = thread?.messages;

  // TODO: agents and assitances should be fetched from BE and stored on zuztang
  // Find from zuztang
  const agent = useMemo(() => {
    return agents.find((a) => a.id === thread?.assistantId);
  }, [thread]);

  const handleSend = async (messageContent: string) => {
    if (!messageContent.trim() || !(user?.credits ?? 0 > 0)) return;

    setInput("");
    addMessageToThreadAsync(messageContent);
  };

  if (!isLoading && !thread) {
    return <div>Thread not found</div>;
  }

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
        className={`flex-1 flex flex-col w-[70%] mx-auto justify-between py-4 gap-4 h-[calc(100vh-4rem)] overflow-hidden`}
      >
        <ThreadView messages={messages ?? []} isMessageWaiting={isMessageWaiting} />

        <div className="flex flex-col bg-[#1A1D23] rounded-2xl shadow-sm w-full transition-transform duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isMessageWaiting) {
                e.preventDefault();
                handleSend(input);
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
              disabled={isMessageWaiting}
              onClick={() => handleSend(input)}
              className={`w-8 h-8 rounded-lg bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center ${
                isMessageWaiting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <IoSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thread;
