// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Optional: for persistence
import Cookies from "js-cookie";

export type UserRole =
  | "admin"
  | "center"
  | "branch_admin"
  | "parent"
  | "nursery";

interface User {
  id: number;
  name: string;
  email: string;
  address: string | null;
  email_verified_at: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  national_number: string | null;
  branch_id: number;
  logo: string | null;
  nurcery_name: string | null;
  phone: string;
  plan_id: number;
  city_id: number;
  center_id: number;
  nursery_name: string;
  location: string;
  neighborhood: string;
  subscription_end_date: string;
  subscription_start_date: string;
  free_trail_end_date: string;
  subscription_status: string;
  type_of_duration: string;
  published_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setUserToken: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  // Optional: Persist state to localStorage
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setUserToken: (user, token) => {
        set({ user, token });
        // Also store in cookies for middleware access
        const authData = { user, token };
        Cookies.set("auth-storage", JSON.stringify(authData), {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      },
      updateUser: (user: Partial<User>) => {
        const token = get().token;
        if (!token) return;

        // Get current user state and merge with new user data
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...user } as User;

        set({ user: updatedUser });

        const authData = { user: updatedUser, token };
        Cookies.set("auth-storage", JSON.stringify(authData), {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // ✅ Also update persisted localStorage manually
        localStorage.setItem(
          "auth-storage",
          JSON.stringify({ state: authData }),
        );
      },

      clearAuth: () => {
        set({ user: null, token: null });
        // Also remove from cookies
        Cookies.remove("auth-storage");
      },
      isAuthenticated: () => !!get().token,
      hasRole: (role) => {
        const userRole = get().user?.role;
        if (!userRole) return false;
        return Array.isArray(role)
          ? role.includes(userRole)
          : role === userRole;
      },
    }),
    {
      name: "auth-storage", // Name for localStorage item
      storage: createJSONStorage(() => localStorage), // Or sessionStorage
    },
  ),
);

// Selector hook for convenience (optional but recommended)
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated());
export const useHasRole = (role: UserRole | UserRole[]) =>
  useAuthStore((state) => state.hasRole(role));
