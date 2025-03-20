import { Thread, ThreadMessage } from "@/types/thread.types";
import { create } from "zustand";

interface ThreadsState {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Thread) => void;
  upsertThread: (threadId: string, thread: Thread) => void;
  addMessageToThread: (threadId: string, message: ThreadMessage) => void;
  clearThreads: () => void;
  removeThread: (threadId: string) => void;
}

export const useThreadsStore = create<ThreadsState>((set) => ({
  threads: [],
  setThreads: (threads) => {
    console.log("setThreads - new threads:", threads);
    set({ threads });
  },
  addThread: (thread) => {
    console.log("addThread - adding thread:", thread);
    set((state) => ({
      threads: [thread, ...state.threads],
    }));
  },
  upsertThread: (threadId, updatedThread) => {
    console.log("upsertThread - upserting thread:", threadId, updatedThread);
    set((state) => {
      const threadExists = state.threads.some(thread => thread._id === threadId);

      if (!threadExists) {
        console.log("upsertThread - thread not found, adding new thread");
        return {
          threads: [updatedThread, ...state.threads]
        };
      }

      const newThreads = state.threads.map((thread) =>
        thread._id === threadId ? updatedThread : thread
      );
      console.log("upsertThread - thread updated, new threads state:", newThreads);
      return { threads: newThreads };
    });
  },
  addMessageToThread: (threadId, message) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread._id === threadId
          ? {
            ...thread,
            messages: [...thread.messages, message],
            lastMessage: message,
          }
          : thread
      ),
    })),
  clearThreads: () => set({ threads: [] }),
  removeThread: (threadId) =>
    set((state) => ({
      threads: state.threads.filter((thread) => thread._id !== threadId),
    })),
}));

