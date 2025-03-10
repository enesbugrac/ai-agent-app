"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import {
  FaRobot,
  FaEllipsisH,
  FaCog,
  FaPaperclip,
  FaImage,
} from "react-icons/fa";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { agents } from "@/data/agents";
import { prompts } from "@/data/prompts";
import PromptCard from "@/components/PromptCard";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import LoadingDots from "@/app/components/LoadingDots";
import "animate.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  isLoading?: boolean;
}

// Helper function for consistent time formatting
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatPage() {
  const params = useParams();
  const agent = agents.find((a) => a.id === params.id);

  if (!agent) {
    notFound();
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [welcomeMessageDissapear, setWelcomeMessageDissapear] = useState(false);

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

    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            text: text,
            sender: "ai",
            timestamp: formatTime(new Date()),
          },
        ]);
        setStreamingMessageId(null);
      }
    }, 30); // Adjust typing speed here
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

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const userMessage = message;
    setWelcomeMessageDissapear(true);

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

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response after 2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const aiMessageId = `ai-${Date.now()}`;
      setThreadId(aiMessageId);

      setStreamingMessageId(aiMessageId);
      simulateStream(
        "This is a simulated response to your message. I'll help you with that!"
      );
    }, 2000);
  };

  const handlePromptClick = (text: string) => {
    handleSend(text);
  };

  const refreshChat = () => {
    setMessages([]);
    setWelcomeMessageDissapear(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full bg-background">
      {/* Chat Header */}
      <div className="z-50 h-16 w-full bg-background-overlay border-b border-border backdrop-blur-sm px-6 flex items-center justify-between">
        <button
          onClick={refreshChat}
          className="text-secondary hover:text-primary flex items-center gap-2 text-xs"
        >
          Refresh Chat
        </button>
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

      <div
        className={`flex-1 flex flex-col w-[70%] ${
          messages.length > 0 ? "justify-between" : "justify-center"
        } py-4 gap-4`}
      >
        {/* Welcome Message */}

        {messages.length === 0 && (
          <div
            id="welcome-message"
            className={`animate__animated ${
              welcomeMessageDissapear ? "animate__fadeOutUp" : ""
            }`}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-medium mb-2">
                Hello! I&apos;m,{" "}
                <span className="text-tertiary">{agent.name}</span>
              </h1>
              <h1 className="text-4xl text-primary">
                {" "}
                How can I assist you today?
              </h1>
              <p className="text-secondary text-sm mt-2">
                Use one of the most common prompts below or use your own to
                begin
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
          </div>
        )}

        {messages.length > 0 && (
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`mb-4 rounded-lg max-w-2xl ${
                    message.sender === "user"
                      ? "bg-[#1A1D23] text-white ml-auto py-3 px-4"
                      : " text-white mr-auto p-0"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-typing-dot"></div>
              </div>
            )}

            {isStreaming && (
              <div className="flex justify-start">
                <div className="rounded-lg max-w-2xl text-white mr-auto mb-4">
                  <p>{streamingText}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input */}

        <div
          className={`flex flex-col bg-[#1A1D23] rounded-2xl shadow-sm w-full`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
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
              onClick={() => handleSend(input)}
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
