import { create } from 'zustand';

interface MobileSidebarState {
  // Sidebar visibility state
  open: boolean;
  setOpen: (open: boolean) => void;
  
  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Reset all states to default
  reset: () => void;
}

export const useMobileSidebarStore = create<MobileSidebarState>()((set) => ({
  // Initial states
  open: false,
  loading: false,
  
  // State setters
  setOpen: (open: boolean) => set({ open }),
  setLoading: (loading: boolean) => set({ loading }),
  
  // Reset function
  reset: () => set({ open: false, loading: false }),
}));
