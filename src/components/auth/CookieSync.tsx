"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";

export default function CookieSync() {
  const { user, token, setUserToken } = useAuthStore();

  useEffect(() => {
    // On app initialization, sync localStorage data to cookies
    if (user && token) {
      const authData = { user, token };
      Cookies.set('auth-storage', JSON.stringify(authData), {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  }, [user, token]);

  // Check if cookie exists but localStorage doesn't (edge case)
  useEffect(() => {
    const cookieData = Cookies.get('auth-storage');
    if (cookieData && !user && !token) {
      try {
        const authData = JSON.parse(cookieData);
        if (authData.user && authData.token) {
          setUserToken(authData.user, authData.token);
        }
      } catch (error) {
        console.error('Error parsing cookie auth data:', error);
        Cookies.remove('auth-storage');
      }
    }
  }, [user, token, setUserToken]);

  return null; // This component doesn't render anything
}
