import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  secondarySidebarOpen: boolean;
  setSecondarySidebarOpen: (open: boolean) => void;
  toggleSecondarySidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      secondarySidebarOpen: true,
      setSecondarySidebarOpen: (open) => set({ secondarySidebarOpen: open }),
      toggleSecondarySidebar: () =>
        set((state) => ({ secondarySidebarOpen: !state.secondarySidebarOpen })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selector hooks for convenience
export const useSecondarySidebarOpen = () =>
  useSidebarStore((state) => state.secondarySidebarOpen);
export const useSetSecondarySidebarOpen = () =>
  useSidebarStore((state) => state.setSecondarySidebarOpen);
export const useToggleSecondarySidebar = () =>
  useSidebarStore((state) => state.toggleSecondarySidebar);
