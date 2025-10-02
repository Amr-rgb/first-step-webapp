import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserPreferences {
  notificationToastsEnabled: boolean;
}

interface UserPreferencesState {
  preferences: UserPreferences;
  setNotificationToastsEnabled: (enabled: boolean) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  notificationToastsEnabled: true,
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,

      setNotificationToastsEnabled: (enabled: boolean) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notificationToastsEnabled: enabled,
          },
        })),

      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
