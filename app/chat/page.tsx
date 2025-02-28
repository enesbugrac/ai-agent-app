"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaRobot, FaUser, FaEllipsisH, FaCog } from "react-icons/fa";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Merhaba! Size nasıl yardımcı olabilirim?",
      sender: "ai",
      timestamp: new Date(),
    },
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
            id: Date.now() + 1,
            text: currentText.trim(),
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      }
    }, 50); // Her kelime için 50ms bekle
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
        id: Date.now(),
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setInput("");

    setIsTyping(true);
    fetchAIResponse(userMessage).then((aiResponse) => {
      setIsTyping(false);
      simulateStream(aiResponse);
    });
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Chat Header */}
      <div className="bg-black/50 border-b border-[#F3BA2F]/10 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F3BA2F] p-[1px]">
            <div className="w-full h-full rounded bg-black flex items-center justify-center">
              <FaRobot className="text-lg text-[#F3BA2F]" />
            </div>
          </div>
          <div>
            <h1 className="text-[#F3BA2F] font-medium text-sm">Chat Assistant</h1>
            <span className="text-[#888] text-xs">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-[#F3BA2F]/10 text-[#888] hover:text-[#F3BA2F] transition-all">
            <FaCog className="text-sm" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F3BA2F]/10 text-[#888] hover:text-[#F3BA2F] transition-all">
            <FaEllipsisH className="text-sm" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.sender === "user"
                  ? "bg-[#F3BA2F] text-black"
                  : "bg-[#F3BA2F]/10 text-[#F3BA2F]"
              }`}
            >
              {message.sender === "user" ? (
                <FaUser className="text-sm" />
              ) : (
                <FaRobot className="text-sm" />
              )}
            </div>
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                message.sender === "user"
                  ? "bg-[#F3BA2F] text-black"
                  : "bg-[#F3BA2F]/10 text-[#F3BA2F]"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-[10px] opacity-50 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {(isTyping || isStreaming) && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#F3BA2F]/10 text-[#F3BA2F]">
              <FaRobot className="text-sm" />
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#F3BA2F]/10 text-[#F3BA2F]">
              {isTyping ? (
                <div className="flex gap-1 items-center">
                  <div
                    className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm">{streamingText}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-[#F3BA2F]/10">
        <div className="bg-[#F3BA2F]/5 backdrop-blur-sm rounded-xl p-1 border border-[#F3BA2F]/10">
          <div className="bg-black/50 rounded-lg flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-transparent border-none outline-none text-[#888] placeholder-[#666] text-sm px-4 py-3"
            />
            <button
              onClick={handleSend}
              className="p-2 mr-2 rounded-lg bg-[#F3BA2F] text-black hover:bg-[#F3BA2F]/90 transition-all"
            >
              <IoSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
