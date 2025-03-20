import { ThreadMessage } from "@/types/thread.types";

interface ThreadViewProps {
  messages: ThreadMessage[];
  isMessageWaiting: boolean;
}

export default function ThreadView({
  messages,
  isMessageWaiting,
}: ThreadViewProps) {
  return (
    <div className="flex-1 overflow-y-scroll overflow-x-hidden pr-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex animate__animated animate__fadeInUp animate__faster ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`mb-4 rounded-lg max-w-2xl ${message.role === "user"
                ? "bg-[#1A1D23] text-white ml-auto py-3 px-4"
                : "text-white mr-auto p-0"
                }`}
            >
              <p>{message.content}</p>
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


      </div>
    </div>
  );
}


/**
 *   {isStreaming && (
          <div className="flex justify-start">
            <div className="rounded-lg max-w-2xl text-white mr-auto mb-4">
              <p>{streamingText}</p>
            </div>
          </div>
        )}
 */