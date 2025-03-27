import { ThreadMessage } from "@/types/thread.types";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
              className={`mb-4 rounded-lg max-w-2xl ${
                message.role === "user"
                  ? "bg-[#1A1D23] text-white ml-auto py-3 px-4"
                  : "bg-[#1A1D23]/50 text-white mr-auto p-4"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Paragraf stili
                    p: ({ children }) => (
                      <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
                    ),
                    // Başlık stilleri
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mb-2">{children}</h3>
                    ),
                    // Liste stilleri
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 mb-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 mb-4">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    // Kod bloğu stili
                    code(props) {
                      const { className, children } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-black/20 rounded px-1.5 py-0.5 text-xs font-mono">
                          {children}
                        </code>
                      );
                    },
                    // Blockquote stili
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    // Link stili
                    a: ({ children, href }) => (
                      <a href={href} className="text-primary hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
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
