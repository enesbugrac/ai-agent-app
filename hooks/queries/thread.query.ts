import { useThreadsStore } from "@/store/useThreadsStore";
import { MessageRole, Thread, ThreadMessage } from "@/types/thread.types";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { api } from "@/utils/fetch.utilts";

export const useThreadQuery = () => {
  const { id: threadId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { threads, upsertThread } = useThreadsStore();

  const currentThread = useMemo(() => {
    return threads.find((thread) => thread._id === threadId);
  }, [threads, threadId]);

  const fetchThreadAsync = async () => {
    try {
      if (!threadId) {
        console.error("Thread ID is required");
        return;
      }

      setIsLoading(true);
      const data = await api.fetch<Thread>(`/threads/${threadId}`);
      upsertThread(threadId as string, data);
      return data;
    } catch (error) {
      console.error("Thread fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchThreadAsync();
    }
  }, [threadId]);

  return { thread: currentThread, fetchThreadAsync, isLoading };
};

export const useThreadMutation = () => {
  const { id: threadId } = useParams();
  const { addMessageToThread, addThread } = useThreadsStore();
  const [isMessageWaiting, setIsMessageWaiting] = useState(false);
  const [isThreadCreating, setIsThreadCreating] = useState(false);
  const [initialMessage, setInitialMessage] = useState<ThreadMessage | null>(null);

  const createThreadAsync = async (message: string, assistantId: string) => {
    try {
      setIsThreadCreating(true);

      const userMessage = {
        _id: `${Date.now()}`,
        role: MessageRole.USER,
        content: message,
        threadId: "temp",
      };
      setInitialMessage(userMessage);

      const data = await api.fetch<{ threadId: string; content: string }>("/threads", {
        method: "POST",
        body: JSON.stringify({ message, assistantId }),
      });

      const newThread: Thread = {
        _id: data.threadId,
        messages: [
          userMessage,
          {
            _id: `${Date.now()}-assistant`,
            threadId: data.threadId,
            role: MessageRole.ASSISTANT,
            content: data.content,
          },
        ],
        assistantId,
        userId: "temp",
        name: message.slice(0, 30) + "...",
        lastMessage: userMessage,
        openAiThreadId: "temp",
      };

      addThread(newThread);
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

      const userMessage = {
        _id: `${Date.now()}`,
        threadId: threadId as string,
        role: MessageRole.USER,
        content,
      };
      addMessageToThread(threadId as string, userMessage);

      const data = await api.fetch<{ content: string }>(`/threads/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      const assistantMessage = {
        _id: `${Date.now()}-assistant`,
        threadId: threadId as string,
        role: MessageRole.ASSISTANT,
        content: data.content,
      };
      addMessageToThread(threadId as string, assistantMessage);
    } catch (error) {
      console.error("Message send error:", error);
      throw error;
    } finally {
      setIsMessageWaiting(false);
    }
  };

  return {
    isMessageWaiting,
    isThreadCreating,
    initialMessage,
    createThreadAsync,
    addMessageToThreadAsync,
  };
};
