"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { IoSend } from "react-icons/io5";
import { FaEllipsisH, FaCog, FaPaperclip, FaImage } from "react-icons/fa";
import { notFound, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { agents } from "@/data/agents";
import AgentView from "../components/AgentView";
import ThreadView from "../components/ThreadView";
import "animate.css";
import { useThreadsStore } from "@/app/store/useThreadsStore";

interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  isLoading?: boolean;
  createdAt?: string;
}

// Helper function for consistent time formatting
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const { threads } = useThreadsStore();
  const { id } = params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const currentThread = useMemo(
    () => threads.find((t) => t._id === threadId),
    [threads, threadId]
  );
  const agent = useMemo(
    () =>
      agents.find(
        (a) => a.displayId === params.id || a.id === currentThread?.assistantId
      ),
    [params.id, currentThread]
  );

  const [welcomeMessageDissapear, setWelcomeMessageDissapear] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateStream = (message: Message) => {
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

  const fetchThread = async (threadId: string) => {
    try {
      setWelcomeMessageDissapear(true);
      const response = await fetch(`/api/chat/thread/${threadId}`);
      const data = await response.json();
      setThreadId(data._id);
      setMessages(data.messages);
    } catch (error) {
      console.error("Thread fetch error:", error);
      notFound();
    }
  };

  const createThread = async (message: string) => {
    try {
      const response = await fetch("/api/chat/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: "asst_DNjos1zUGKOjV7lgD6wwtxRJ",
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Thread creation failed");
      }

      const data = await response.json();
      setThreadId(data.id);

      router.replace(`/chat/${data.id}`);

      return data;
    } catch (error) {
      console.error("Thread creation error:", error);
      return null;
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    if (threadId) setWelcomeMessageDissapear(true);

    if (inputContainerRef.current && !threadId) {
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

    const userMessageId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        _id: userMessageId,
        content: message,
        role: "user",
        timestamp: formatTime(new Date()),
      },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      if (!threadId) {
        const threadResponse = await createThread(message);
        if (!threadResponse) {
          setIsTyping(false);
          return;
        }
        const lastMessage = threadResponse.messages[threadResponse.messages.length - 1];
        simulateStream(lastMessage);
      } else {
        const response = await fetch(`/api/chat/thread/${threadId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message.trim() }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const data = await response.json();
        simulateStream(data);
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Message send error:", error);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  useEffect(() => {
    const agent = agents.find((a) => a.displayId === id);
    if (agent) {
      return;
    }
    fetchThread(id as string);
  }, [id]);

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
        className={`flex-1 flex flex-col w-[70%] mx-auto ${
          threadId ? "justify-between" : "justify-center"
        } py-4 gap-4 h-[calc(100vh-4rem)] overflow-hidden`}
      >
        {!threadId ? (
          <AgentView
            agent={agent!}
            onPromptClick={handleSend}
            welcomeMessageDissapear={welcomeMessageDissapear}
          />
        ) : (
          <ThreadView
            messages={messages}
            isTyping={isTyping}
            isStreaming={isStreaming}
            streamingText={streamingText}
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
