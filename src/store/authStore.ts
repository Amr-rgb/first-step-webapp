// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Optional: for persistence
import Cookies from "js-cookie";

export type UserRole = "admin" | "center" | "branch_admin" | "parent";

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
}

interface AuthState {
  token: string | null;
  user: User | null;
  setUserToken: (user: User, token: string) => void;
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
        Cookies.set('auth-storage', JSON.stringify(authData), {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      },
      clearAuth: () => {
        set({ user: null, token: null });
        // Also remove from cookies
        Cookies.remove('auth-storage');
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
    }
  )
);

// Selector hook for convenience (optional but recommended)
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated());
export const useHasRole = (role: UserRole | UserRole[]) =>
  useAuthStore((state) => state.hasRole(role));
