import { useThreadsStore } from "@/store/useThreadsStore";
import { MessageRole, Thread, ThreadMessage } from "@/types/thread.types";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { usePrivateFetch } from "../fetch.hooks";
import { Agent } from "@/data/agents";
export const useThreadQueryAsync = () => {

  const { id: threadId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { threads, upsertThread } = useThreadsStore();

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

      if (threadId.length!==24) {
        console.error("Thread ID is required");
        return;
      }

      setIsLoading(true);
      const data = await privateFetch<Thread>(`/threads/${threadId}`);
     if(!data._id){
        throw Error('Thread fetch error')
     }

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
  }


  useEffect(() => {
    fetchThreadAsync();
  }, [threadId]);

  return { thread: currentThread, fetchThreadAsync, isLoading };
};


export const useCurrentThreadCache = () => {
  const { id: threadId } = useParams();

  const { threads } = useThreadsStore();


  const currentThread = useMemo(() => {
    return threads.find((thread) => thread._id === threadId);
  }, [threads, threadId]);

  return { thread: currentThread };
};

export const useThreadMutation = () => {
  const { id: threadId } = useParams();
  const { addMessageToThread, addThread, } = useThreadsStore();
  const [isMessageWaiting, setIsMessageWaiting] = useState(false);
  const { thread: currentThread } = useCurrentThreadCache();
  const [isThreadCreating, setIsThreadCreating] = useState(false);
  const [initialMessage, setInitialMessage] = useState<ThreadMessage | null>(null);

  const { privateFetch } = usePrivateFetch();

  const createThreadAsync = async (message: string, agent: Agent) => {
    try {
      setIsThreadCreating(true);

      const userMessage = {
        _id: `${Date.now()}`,
        role: MessageRole.USER,
        content: message,
        threadId: "temp",
      };
      setInitialMessage(userMessage);

      const newThread = await privateFetch<Thread>("/threads", {
        method: "POST",
        body: JSON.stringify({ message, agent }),
      });

      console.log('new thread', newThread)
      addThread(newThread);
      return newThread;
    } catch (error) {
      console.error("Thread creation error:", error);
      throw error;
    } finally {
      setIsThreadCreating(false);
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
