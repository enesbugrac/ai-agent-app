import { useThreadsStore } from "@/store/useThreadsStore";
import { MessageRole, Thread, ThreadMessage } from "@/types/thread.types";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";

export const useThreadQuery = () => {
    const { id: threadId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const { threads, setThreads, addThread, upsertThread } = useThreadsStore();

    console.log("useThreadQuery - threadId:", threadId);
    console.log("useThreadQuery - current threads:", threads);

    const currentThread = useMemo(() => {
        const found = threads.find((thread) => thread._id === threadId);
        console.log("useThreadQuery - currentThread:", found);
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

            console.log("fetchThreadAsync - received data:", data);
            console.log("fetchThreadAsync - upserting thread with id:", threadId);

            const beforeUpdate = useThreadsStore.getState().threads;
            console.log("fetchThreadAsync - store before upsert:", beforeUpdate);

            upsertThread(threadId as string, data);

            const afterUpdate = useThreadsStore.getState().threads;
            console.log("fetchThreadAsync - store after upsert:", afterUpdate);

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
    }, [threadId]); // threadId'yi dependency array'e ekledik

    return {
        thread: currentThread,
        fetchThreadAsync,
        isLoading,
    };
};

export const useThreadMutation = () => {
    const [firstMessage, setFirstMessage] = useState<ThreadMessage | null>(null);
    const { id: threadId } = useParams();
    const { addMessageToThread, addThread } = useThreadsStore();
    const [isMessageWaiting, setIsMessageWaiting] = useState(false);
    const [isThreadAdding, setIsThreadAdding] = useState(false);

    const addMessageToThreadAsync = async (content: string) => {
        try {
            setIsMessageWaiting(true);

            // optimistic write for user message
            addMessageToThread(threadId as string, {
                _id: `${Date.now()}`, //This will be replaced with the actual id from the server
                threadId: threadId as string,
                role: MessageRole.USER,
                content,
            });

            const response = await fetch(`/api/thread/${threadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const assistantMessage: ThreadMessage = await response.json();

            // update the message with the actual id
            addMessageToThread(threadId as string, assistantMessage);
        } catch (error) {
            console.error("Message send error:", error);
            throw error;
        } finally {
            setIsMessageWaiting(false);
        }
    };

    const addThreadAsync = async (message: string, assistantId: string) => {
        try {
            setIsThreadAdding(true);
            setFirstMessage({
                _id: `${Date.now()}`,
                threadId: threadId as string,
                role: MessageRole.USER,
                content: message,
            });
            const response = await fetch('/api/thread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, assistantId }),
            });

            const data: Thread = await response.json();
            addThread(data);
            return data;
        } catch (error) {
            console.error("Thread creation error:", error);
            throw error;
        } finally {
            setIsThreadAdding(false);
        }
    };

    return {
        firstMessage,
        isThreadAdding,
        isMessageWaiting,
        addThreadAsync,
        addMessageToThreadAsync,
    };
};