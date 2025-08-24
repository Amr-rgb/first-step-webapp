import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SubscriptionState {
  subscriptionRequired: boolean;
  setSubscriptionRequired: (value: boolean) => void;
  clear: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscriptionRequired: false,
      setSubscriptionRequired: (value) => set({ subscriptionRequired: value }),
      clear: () => set({ subscriptionRequired: false }),
    }),
    {
      name: "subscription-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSubscriptionRequired = () =>
  useSubscriptionStore((s) => s.subscriptionRequired);
