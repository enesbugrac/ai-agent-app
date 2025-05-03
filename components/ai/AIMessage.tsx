import React from "react";
import ArbitrageScanUI from "./generativeUi/ArbitrageScanUI";
import SwapUI from "./generativeUi/SwapUI";
import { ThreadMessage } from "@/types/thread.types";
import { ArbitrageScanMetadata, SwapMetadata } from "@/types/tools.types";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type AIMessageProps = {
  message: ThreadMessage;
};

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const { toolJson } = message;
  const { content } = message;

  const renderAgentUi = () => {
    if (!toolJson) return null;

    const metadata = toolJson.metadata;
    const toolType = metadata.type;

    switch (toolType) {
      case "arbitrage-scan":
        return <ArbitrageScanUI toolData={metadata as ArbitrageScanMetadata} />;
      case "swap":
        return <SwapUI toolData={metadata as SwapMetadata} />;
    }
  };

  return (
    <div className="message-component rounded-lg  w-full">
      <div className="flex items-center mb-4">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">
          A
        </div>
        <span className="ml-3 text-white font-medium">AI Agent</span>
      </div>
      {toolJson?.isUi && <div className="ai-agent-tool-ui mt-2">{renderAgentUi()}</div>}

      <div className="text-secondary mb-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Paragraf stili
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
            ),
            // Başlık stilleri
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
            // Liste stilleri
            ul: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            // Kod bloğu stili
            code(props) {
              const { className, children } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
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
          {content}
        </ReactMarkdown>
      </div>

      {/* {toolJson?.metadata?.content && !toolJson.isUi && (
        <div className="ai-agent-tool-ui mt-2 p-3 bg-slate-800 rounded text-gray-400 text-sm">
          <p>{toolJson.metadata.content}</p>
        </div>
      )} */}
    </div>
  );
};

export default AIMessage;
