import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/api";
import { toastError } from "@/lib/toast";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let isInitialized = false;

export const initializeGoogleAuth = () => {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    isInitialized = true;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
};

const handleGoogleSignIn = async (credential: any) => {
  try {
    const result = await authService.googleSignIn(credential);

    // Use setUserToken to properly set both state and cookies
    useAuthStore.getState().setUserToken(result.user, result.token);

    let dashboardPath = "/dashboard/center";
    if (result.user.role === "parent") {
      dashboardPath = "/dashboard/parent";
    } else if (result.user.role === "admin") {
      dashboardPath = "/dashboard/admin";
    } else if (result.user.role === "branch_admin") {
      dashboardPath = result.user.center_id ? "/dashboard/center" : "/dashboard/nursery";
    }

    window.location.href = dashboardPath;
  } catch (error: any) {
    console.error("Google sign-in failed:", error);
    toastError(
      error.message || "Failed to sign in with Google. Please try again."
    );
  }
};

export const triggerGoogleSignIn = async () => {
  if (typeof window === "undefined") return;

  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // Start the sign-in process
    const signInPromise = handleGoogleSignIn(credential?.accessToken);

    // Return a promise that resolves after redirect
    return new Promise((resolve) => {
      signInPromise
        .then(() => {
          // The redirect will happen in handleGoogleSignIn
          // This promise will never resolve, keeping the loading state
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
    });
  } catch (error: any) {
    console.error("Google sign-in failed:", error);
    toastError("Failed to sign in with Google. Please try again.");
    return false;
  }
};
