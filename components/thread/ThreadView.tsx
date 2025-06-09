'use client'

import AIMessage from "@/components/ai/AIMessage";
import { ThreadMessage } from "@/types/thread.types";
import { useEffect, useRef } from "react";

interface ThreadViewProps {
  messages: ThreadMessage[];
  isMessageWaiting: boolean;
}

export default function ThreadView({ messages, isMessageWaiting }: ThreadViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMessageWaiting]);


  return (
      <div className="h-[85%] w-[100%] flex  flex-col gap-4 overflow-y-scroll scrollbar-hide md:scrollbar-auto py-4 px-0 md:px-4 md:py-4">
        {messages.map((message, index) => (
          <div
            key={`${message._id}-${index}`}
            className={`flex  ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`mb-4 rounded-lg ${message.role === "user"
                ? "max-w-2xl bg-[#1A1D23] text-white ml-auto py-3 px-4"
                : "w-full text-white mr-auto"
                }`}
            >
              {message.role === "user" ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                <AIMessage message={message} />
              )}
            </div>
          </div>
        ))}

        {isMessageWaiting && (
          <div className="flex justify-start">
            <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

  );
}
