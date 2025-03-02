"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaRobot, FaUser, FaEllipsisH, FaCog, FaChartLine, FaPaperclip, FaImage, FaEnvelope, FaFileAlt, FaCode } from "react-icons/fa";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { agents } from "@/app/data/agents";
import PromptCard from "@/app/components/PromptCard";
import { prompts } from "@/app/data/prompts";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  isLoading?: boolean;
}

// Helper function for consistent time formatting
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ChatPage() {
  const params = useParams();
  const agent = agents.find(a => a.id === params.id);

  if (!agent) {
    notFound();
  }

  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: 'initial',
    //   text: `Hello! I'm ${agent.name}. How can I assist you today?`,
    //   sender: "ai",
    //   timestamp: formatTime(new Date()),
    // },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const simulateStream = (text: string) => {
    setIsStreaming(true);
    setStreamingText("");
    let index = 0;
    const words = text.split(" ");
    let currentText = "";

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += words[index] + " ";
        setStreamingText(currentText);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            text: currentText.trim(),
            sender: "ai",
            timestamp: formatTime(new Date()),
          },
        ]);
      }
    }, 50);
  };

  const fetchAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.result;
    } catch (error) {
      console.error("API Error:", error);
      return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        text: userMessage,
        sender: "user",
        timestamp: formatTime(new Date()),
      },
    ]);
    setInput("");

    setIsTyping(true);
    fetchAIResponse(userMessage).then((aiResponse) => {
      setIsTyping(false);
      simulateStream(aiResponse);
    });
  };

  const handlePromptClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full bg-background">
      {/* Chat Header */}
      <div className="h-16 w-full bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-[60%] justify-center">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium mb-2">
          Hello! I'm, <span className="text-tertiary">{agent.name}</span>
          </h1>
          <h1 className="text-4xl text-primary"> How can I assist you today?</h1>
          <p className="text-secondary text-sm mt-2">
            Use one of the most common prompts below or use your own to begin
          </p>
        </div>

        {/* Prompt Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {prompts.map((prompt, index) => (
            <PromptCard
              key={index}
              icon={prompt.icon}
              text={prompt.text}
              onClick={() => handlePromptClick(prompt.text)}
            />
          ))}
        </div>

        {/* Chat Input */}
        <div className="relative">
          <div className="absolute right-4 top-0 -translate-y-8 flex items-center gap-2">
            <span className="text-xs text-secondary">0/1000</span>
            <button className="text-xs text-secondary hover:text-primary flex items-center gap-1">
              <FaRobot className="text-sm" />
              AI Web
            </button>
          </div>
          <div className="bg-[#1A1D23] rounded-2xl shadow-sm">
            <div className="flex flex-col">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
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
                  onClick={handleSend}
                  className="w-8 h-8 rounded-lg bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center"
                >
                  <IoSend className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
