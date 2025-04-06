import AIMessage from "@/components/ai/AIMessage";
import { ThreadMessage } from "@/types/thread.types";
import { useEffect, useRef } from "react";

interface ThreadViewProps {
  messages: ThreadMessage[];
  isMessageWaiting: boolean;
}

export default function ThreadView({ messages, isMessageWaiting }: ThreadViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMessageWaiting]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary text-sm">No messages yet</p>
          <p className="text-secondary/60 text-xs mt-2">
            Start the conversation by typing a message below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-scroll overflow-x-hidden pr-4">
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <div
            key={`${message._id}-${index}`}
            className={`flex animate__animated animate__fadeInUp animate__faster ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`mb-4 rounded-lg ${
                message.role === "user"
                  ? "max-w-2xl bg-[#1A1D23] text-white ml-auto py-3 px-4"
                  : "w-full text-white mr-auto"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
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
    </div>
  );
}
