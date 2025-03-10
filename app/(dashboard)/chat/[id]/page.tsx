"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaEllipsisH, FaCog, FaPaperclip, FaImage } from "react-icons/fa";
import { notFound, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { agents } from "@/data/agents";
import { prompts } from "@/data/prompts";
import PromptCard from "@/components/PromptCard";
import "animate.css";

interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
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
  const router = useRouter();
  const params = useParams();
  const agent = agents.find((a) => a.displayId === params.displayId);
  const { id } = params;

  if (!agent && !id) {
    notFound();
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [welcomeMessageDissapear, setWelcomeMessageDissapear] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateStream = (message: any) => {
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
            _id: `ai-${Date.now()}`,
            content: message.content,
            role: "assistant",
            timestamp: formatTime(new Date()),
          },
        ]);
        setStreamingMessageId(null);
      }
    }, 30);
  };

  const fetchThread = async (threadId: string) => {
    try {
      setWelcomeMessageDissapear(true);
      const response = await fetch(`/api/chat/thread/${threadId}`);
      const data = await response.json();
      setThreadId(data.openAiThreadId);
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
      setThreadId(data.thread.openAiThreadId);

      // URL'i güncelle
      router.replace(`/chat/${data.thread.openAiThreadId}`);

      return data;
    } catch (error) {
      console.error("Thread creation error:", error);
      return null;
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    if (threadId) setWelcomeMessageDissapear(true);

    // Input container animasyonu
    if (inputContainerRef.current) {
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

    // User mesajını ekle
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
      // İlk mesajsa thread oluştur
      if (!threadId) {
        const threadResponse = await createThread(message);
        if (!threadResponse) {
          setIsTyping(false);
          return;
        }
        const lastMessage = threadResponse.messages[threadResponse.messages.length - 1];
        simulateStream(lastMessage);
      } else {
        // Mevcut thread'e mesaj gönder
        const response = await fetch(`/api/chat/thread/${threadId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const lastMessage = data.assistantMessage;
        simulateStream(lastMessage);
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Message send error:", error);
      setIsTyping(false);
      // Hata mesajı göster
    }
  };

  const handlePromptClick = (text: string) => {
    handleSend(text);
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
    <div className="flex flex-col justify-center items-center h-full bg-background">
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

      {/* Main Chat Area */}

      <div
        className={`flex-1 flex flex-col w-[70%] ${
          messages?.length > 0 ? "justify-between" : "justify-center"
        } py-4 gap-4`}
      >
        {/* Welcome Message */}

        {messages?.length === 0 && (
          <div
            id="welcome-message"
            className={`animate__animated ${
              welcomeMessageDissapear ? "animate__fadeOutUp" : ""
            }`}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-medium mb-2">
                Hello! I&apos;m, <span className="text-tertiary">{agent?.name}</span>
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
          </div>
        )}

        {messages?.length > 0 && (
          <div>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`mb-4 rounded-lg max-w-2xl ${
                    message.role === "user"
                      ? "bg-[#1A1D23] text-white ml-auto py-3 px-4"
                      : " text-white mr-auto p-0"
                  }`}
                >
                  <p>{message.content}</p>
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
          ref={inputContainerRef}
          className={`flex flex-col bg-[#1A1D23] rounded-2xl shadow-sm w-full transition-transform duration-300`}
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
