import { useThreadsStore } from "@/store/useThreadsStore";
import { MessageRole, Thread, ThreadMessage } from "@/types/thread.types";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState, useRef } from "react";
import { usePrivateFetch } from "../fetch.hooks";
import { agents } from "@/data/agents";
export const useThreadQuery = () => {
  const { id: threadId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { threads, upsertThread } = useThreadsStore();
  const isMounted = useRef(false);
  const { privateFetch } = usePrivateFetch();

  const currentThread = useMemo(() => {
    return threads.find((thread) => thread._id === threadId);
  }, [threads, threadId]);

  const fetchThreadAsync = async () => {
    try {

      if (!threadId) {
        console.error("Thread ID is required");
        return;
      }

      const isAgentId = agents.find((agent) => agent.displayId === threadId);
      if (!!isAgentId) {
        console.log("This is starter page");
        return;
      }

      setIsLoading(true);
      const data = await privateFetch<Thread>(`/threads/${threadId}`);

      upsertThread(threadId as string, {
        ...data,
        messages: data.messages,
      });
      return data;
    } catch (error) {
      console.error("Thread fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

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
  const { thread: currentThread } = useThreadQuery();
  const [isThreadCreating, setIsThreadCreating] = useState(false);
  const [initialMessage, setInitialMessage] = useState<ThreadMessage | null>(null);

  const { privateFetch } = usePrivateFetch();

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

      const data = await privateFetch<{ threadId: string; content: string }>("/threads", {
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
      const messageHistory = currentThread?.messages?.map((message) => ({
        role: message.role,
        content: message.content,
      }));
      messageHistory?.push(userMessage);
      const data = await privateFetch<{ content: string }>(`/threads/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          content,
          messageHistory: messageHistory,
        }),
      });

      const assistantMessage = {
        _id: `${Date.now()}-assistant`,
        threadId: threadId as string,
        role: MessageRole.ASSISTANT,
        ...data
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
