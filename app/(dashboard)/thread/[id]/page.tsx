"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { agents } from "@/data/agents";
import "animate.css";
import ThreadStarter from "@/components/thread/ThreadStarter";
import Thread from "@/components/thread/Thread";

export default function ChatPage() {
  const params = useParams();
  const { id: paramsId } = params;

  // TODO: agents and assitances should be fetched from BE and stored on zuztang
  // Find from zuztang
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const agent = useMemo(() => agents.find((a) => a.displayId === params.id), [paramsId]);

  console.log("agent", agent)

  if (agent) {
    return <ThreadStarter agent={agent} />;
  }

  return <Thread />;
}

/**
 *   const simulateStream = (message: ThreadMessage) => {
    setIsStreaming(true);
    setStreamingText("");
    let index = 0;

    const interval = setInterval(() => {
      if (index < message.content.length) {
        setStreamingText((prev) => prev + message.content.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            _id: message._id,
            content: message.content,
            role: "assistant",
            timestamp: formatTime(
              message?.createdAt ? new Date(message.createdAt) : new Date()
            ),
          },
        ]);
      }
    }, 30);
  };
 */
