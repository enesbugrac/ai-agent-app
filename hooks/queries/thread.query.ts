import { useThreadsStore } from "@/store/useThreadsStore";
import { MessageRole, Thread, ThreadMessage } from "@/types/thread.types";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";

export const useThreadQuery = () => {
  const { id: threadId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { threads, upsertThread } = useThreadsStore();

  const currentThread = useMemo(() => {
    const found = threads.find((thread) => thread._id === threadId);
    return found;
  }, [threads, threadId]);

  const fetchThreadAsync = async () => {
    try {
      if (!threadId) {
        console.error("Thread ID is required");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`/api/thread/${threadId}`);
      const data: Thread = await response.json();

      if (!data) {
        throw new Error("Thread not found");
      }

      upsertThread(threadId as string, data);

      return data;
    } catch (error) {
      console.error("Thread fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // threadId değiştiğinde fetchThreadAsync'i çağır
  useEffect(() => {
    if (threadId) {
      fetchThreadAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]); // threadId'yi dependency array'e ekledik

  return {
    thread: currentThread,
    fetchThreadAsync,
    isLoading,
  };
};

export const useThreadMutation = () => {
  const [streamingMessage, setStreamingMessage] = useState("");
  const { id: threadId } = useParams();
  const { addMessageToThread, addThread } = useThreadsStore();
  const [isMessageWaiting, setIsMessageWaiting] = useState(false);
  const [isThreadCreating, setIsThreadCreating] = useState(false);
  const [initialMessage, setInitialMessage] = useState<ThreadMessage | null>(null);

  // Yeni thread oluşturma fonksiyonu
  const createThreadAsync = async (message: string, assistantId: string) => {
    try {
      setIsThreadCreating(true);

      // İlk kullanıcı mesajını oluştur
      const userMessage = {
        _id: `${Date.now()}`,
        role: MessageRole.USER,
        content: message,
        threadId: "temp",
      };
      setInitialMessage(userMessage);

      // Stream response için fetch
      const response = await fetch("/api/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, assistantId }),
      });

      if (!response.body) {
        throw new Error("Stream response failed");
      }
      console.log(response.body);

      // Yeni thread'i store'a ekle

      // Stream okuyucu
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = "";
      let threadId;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        if (!threadId) threadId = chunk.split('"threadId":"')[1].split('"')[0];
        accumulatedMessage += chunk.split('"content":"')[1].split('"')[0];
        setStreamingMessage(accumulatedMessage);
      }
      const newThread = {
        _id: threadId!,
        messages: [userMessage],
        assistantId,
        userId: "temp",
        name: message.slice(0, 30) + "...",
        lastMessage: userMessage,
        openAiThreadId: "temp",
      };
      addThread(newThread);
      // Stream tamamlandığında asistan mesajını store'a ekle
      const assistantMessage = {
        _id: `${Date.now()}-assistant`,
        threadId: threadId!,
        role: MessageRole.ASSISTANT,
        content: accumulatedMessage,
      };
      addMessageToThread(threadId!, assistantMessage);

      // Stream'i temizle
      setStreamingMessage("");

      return newThread;
    } catch (error) {
      console.error("Thread creation error:", error);
      throw error;
    } finally {
      setIsThreadCreating(false);
      setInitialMessage(null);
    }
  };

  const addMessageToThreadAsync = async (content: string) => {
    try {
      setIsMessageWaiting(true);

      // Kullanıcı mesajını ekle
      addMessageToThread(threadId as string, {
        _id: `${Date.now()}`,
        threadId: threadId as string,
        role: MessageRole.USER,
        content,
      });

      // Stream response için fetch
      const response = await fetch(`/api/thread/${threadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream response failed");
      }

      // Stream okuyucu
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulatedMessage += chunk.split('"content":"')[1].split('"')[0];
        setStreamingMessage(accumulatedMessage);
      }

      // Stream tamamlandığında mesajı store'a ekle
      addMessageToThread(threadId as string, {
        _id: `${Date.now()}-assistant`,
        threadId: threadId as string,
        role: MessageRole.ASSISTANT,
        content: accumulatedMessage,
      });

      // Stream'i temizle
      setStreamingMessage("");
    } catch (error) {
      console.error("Message send error:", error);
      throw error;
    } finally {
      setIsMessageWaiting(false);
    }
  };

  return {
    streamingMessage,
    isMessageWaiting,
    isThreadCreating,
    initialMessage,
    createThreadAsync,
    addMessageToThreadAsync,
  };
};
