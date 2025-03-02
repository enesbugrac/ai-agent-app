import { create } from "zustand";

interface User {
  id: string;
  wallet: string;
  role: string;
  credits: number;
  // API'den gelecek diğer user fieldları buraya eklenebilir
}

interface AuthState {
  appUser: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  appUser: null,
  isAuthenticated: false,
  setUser: (appUser) => set({ appUser, isAuthenticated: !!appUser }),
}));
