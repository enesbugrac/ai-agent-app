import { create } from "zustand";

export interface Thread {
  id: string;
  assistantId: string;
  _id: string;
  openAiThreadId: string;
  messages: {
    _id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ThreadsState {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Thread) => void;
  updateThread: (threadId: string, thread: Thread) => void;
}

export const useThreadsStore = create<ThreadsState>((set) => ({
  threads: [],
  setThreads: (threads) => set({ threads }),
  addThread: (thread) =>
    set((state) => ({
      threads: [thread, ...state.threads],
    })),
  updateThread: (threadId, updatedThread) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? updatedThread : thread
      ),
    })),
}));
