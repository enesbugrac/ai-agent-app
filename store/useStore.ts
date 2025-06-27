import { create } from "zustand";
import { User } from "@/types/user.types";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  decreaseCredit: () => void; // Renamed and removed amount parameter
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({ // Add 'get' to access current state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      // Implement decreaseCredit function (decreases by 1)
      decreaseCredit: () => {
        const currentUser = get().user;
        if (currentUser && currentUser.credits >= 1) { // Check if credits >= 1
          set({
            user: { ...currentUser, credits: currentUser.credits - 1 , creditsUsage: currentUser.creditsUsage +1 }, // Decrease by 1
          });
        } else {
          // Optional: Handle insufficient credits case, e.g., log a warning
          console.warn("Attempted to decrease credits below zero or user is null.");
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
