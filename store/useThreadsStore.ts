import { Thread, ThreadMessage } from "@/types/thread.types";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';


interface ThreadsState {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Thread) => void;
  upsertThread: (threadId: string, thread: Thread) => void;
  addMessageToThread: (threadId: string, message: ThreadMessage) => void;
  // Add the new function signature to the interface
  updateThreadsWithoutMessages: (updates: Thread[]) => void;
  clearThreads: () => void;
  removeThread: (threadId: string) => void;
}

export const useThreadsStore = create<ThreadsState>()(
  persist(
    (set) => ({
      threads: [],
      setThreads: (threads) => {
        set(() => ({
          threads: [...threads],
        }));
      },
      addThread: (thread) => {
        set((state) => ({
          threads: [thread, ...state.threads],
        }));
      },
      upsertThread: (threadId, updatedThread) => {
        set((state) => {
          const threadIndex = state.threads.findIndex((thread) => thread._id === threadId);
          if (threadIndex === -1) {
            return {
              threads: [updatedThread, ...state.threads],
            };
          }
          const newThreads = [...state.threads];
          newThreads[threadIndex] = updatedThread;
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

      updateThreadsWithoutMessages: (updates) => {
        set((state) => {
          if (!updates || updates.length === 0) {
            return { threads: [] };
          }

          const originalMessagesMap = new Map(state.threads.map(thread => [thread._id, thread.messages]));


          const newThreads = updates.map(updateData => {
            const originalMessages = originalMessagesMap.get(updateData._id) || [];
            const { messages, ...restOfUpdateData } = updateData;

            return {
              ...restOfUpdateData,
              _id: updateData._id,
              messages: originalMessages,
            };
          });

          return { threads: newThreads };
        });
      },

      clearThreads: () => set({ threads: [] }),
      removeThread: (threadId) =>
        set((state) => ({
          threads: state.threads.filter((thread) => thread._id !== threadId),
        })),
    }),
    {
      name: 'threads-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// --- Example Usage ---
/*
// Assuming useThreadsStore is imported and you have some initial threads

// Example update data: Update name for thread '123' and assistantId for thread '456'
const updatesToApply: ThreadUpdatePayload[] = [
  { _id: '123', name: 'Updated Thread Name One' },
  { _id: '456', assistantId: 'new-assistant-id-xyz' },
  { _id: '789', name: 'This name will update', lastMessage: someNewLastMessageObject } // Can update lastMessage too
];

// Get the setter function from the store
const updateThreadsMetaData = useThreadsStore.getState().updateThreadsWithoutMessages;

// Call the function with the updates
updateThreadsMetaData(updatesToApply);

// Now the threads with _id '123' and '456' in the store will have their
// 'name' and 'assistantId' updated respectively, but their 'messages' array
// will remain exactly as it was before the update. Thread '789' updates too.
// Other threads are unaffected.
*/