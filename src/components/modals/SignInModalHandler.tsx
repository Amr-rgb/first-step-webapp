"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/api";
import { Button } from "@/components/ui/button";
import SignInForm from "@/app/[locale]/(website)/(auth)/sign-in/_components/SignInForm";
import { SignInFormData } from "@/lib/schemas";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ApiError } from "@/lib/error-handling";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, UserRound, X, ArrowLeft } from "lucide-react";

type ViewType = "signin" | "account-type";

// Create a global state for the modal
let globalModalState = {
  isOpen: false,
  setIsOpen: (open: boolean) => {
    globalModalState.isOpen = open;
    // Trigger re-render for all modal instances
    window.dispatchEvent(new CustomEvent('signInModalToggle', { detail: { isOpen: open } }));
  }
};

// Export function to open modal from anywhere
export const openSignInModal = () => {
  // Store current path for returning to it later
  const currentPath = window.location.pathname;
  sessionStorage.setItem('previousPath', currentPath);
  
  // Extract locale from current path (e.g., /en/contact -> en)
  const localeMatch = currentPath.match(/^\/(en|ar)/);
  const locale = localeMatch ? localeMatch[1] : 'en';
  
  // Update URL to locale-specific sign-in route
  const signInPath = `/${locale}/sign-in`;
  if (currentPath !== signInPath) {
    window.history.pushState(null, '', signInPath);
  }
  
  globalModalState.setIsOpen(true);
};

const SignInModalHandler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("signin");
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<UseFormReturn<SignInFormData> | null>(null);
  const t = useTranslations("auth");

  const onError = (error: ApiError) => {
    if (!formRef.current) return;

    // Handle field-specific validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        if (field === "email" || field === "password") {
          formRef.current?.setError(field, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        }
      });
    }

    // Always show the main error message
    formRef.current.setError("root", {
      type: "server",
      message: error.message,
    });
  };

  // --- Data Fetching & Mutation ---
  const mutation = useMutation<
    { token: string; user: any }, // Success response type
    ApiError, // Error type
    SignInFormData // Input type
  >({
    mutationFn: async (data: SignInFormData) => {
      return await authService.login(data.email, data.password);
    },
    onSuccess: (data) => {
      useAuthStore.setState({
        token: data.token,
        user: data.user,
      });

      let dashboardPath = "/dashboard/center";

      if (data.user.role === "center") {
        dashboardPath = "/dashboard/center";
      } else if (data.user.role === "parent") {
        dashboardPath = "/dashboard/parent";
      } else if (data.user.role === "admin") {
        dashboardPath = "/dashboard/admin";
      }

      router.push(dashboardPath);
    },
    onError,
  });

  const onSubmit = async (data: SignInFormData) => {
    // Clear any existing errors before submitting
    if (formRef.current) {
      formRef.current.clearErrors();
    }
    mutation.mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset mutation state when dialog is closed
      mutation.reset();
      setCurrentView("signin");
      
      // Get the stored previous path or use current locale as fallback
      const storedPath = sessionStorage.getItem('previousPath');
      if (storedPath) {
        // Navigate back to the stored previous path
        window.history.replaceState(null, '', storedPath);
        sessionStorage.removeItem('previousPath');
      } else {
        // Fallback: remove /sign-in from current URL
        const currentPath = window.location.pathname;
        if (currentPath.includes('/sign-in')) {
          const localeMatch = currentPath.match(/^\/(en|ar)/);
          const locale = localeMatch ? localeMatch[1] : 'en';
          window.history.replaceState(null, '', `/${locale}`);
        }
      }
      
      globalModalState.setIsOpen(false);
    }
  };

  // Listen for global modal state changes
  useEffect(() => {
    const handleModalToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
      if (event.detail.isOpen) {
        setCurrentView("signin");
      }
    };

    window.addEventListener('signInModalToggle', handleModalToggle as EventListener);
    
    // Check for direct navigation to sign-in routes
    if (pathname.includes("sign-in")) {
      globalModalState.setIsOpen(true);
    }

    return () => {
      window.removeEventListener('signInModalToggle', handleModalToggle as EventListener);
    };
  }, [pathname]);

  const handleBackToSignIn = () => {
    setCurrentView("signin");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                when: "beforeChildren",
                staggerChildren: 0.05,
              }}
              className="p-6"
            >
              {currentView === "signin" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold text-primary">
                        {t("sign-in.title")}
                      </DialogTitle>
                    </DialogHeader>
                  </motion.div>

                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <SignInForm
                      formRef={formRef}
                      onSubmit={onSubmit}
                      isLoading={mutation.isPending}
                    />
                    <motion.div
                      className="mt-4 text-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3 },
                      }}
                    >
                      {t("sign-in.no-account")}{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:no-underline font-medium relative group"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentView("account-type");
                        }}
                      >
                        <span className="relative inline-block">
                          {t("sign-in.sign-up")}
                          <motion.span
                            className="absolute bottom-0 left-0 w-full h-[1px] bg-primary"
                            initial={{ scaleX: 0, transformOrigin: "right" }}
                            whileHover={{
                              scaleX: 1,
                              transformOrigin: "left",
                              transition: { duration: 0.3, ease: "easeOut" },
                            }}
                          />
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <>
                  <DialogHeader className="relative">
                    <DialogTitle className="text-center text-2xl font-bold text-foreground">
                      {t("sign-up.select-account-type")}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {t("sign-up.select-account-description")}
                    </p>
                  </DialogHeader>

                  <div className="mt-6 space-y-4">
                    {/* Center Account Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <motion.div
                        className="relative overflow-hidden rounded-lg"
                        whileHover="hover"
                        whileTap={{ scale: 0.98 }}
                        initial="initial"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full h-auto p-6 flex items-start space-x-4 hover:border-primary/50 transition-all duration-300 relative overflow-visible hover:!bg-transparent"
                          onClick={() => {
                            // Close modal and navigate to center signup
                            globalModalState.setIsOpen(false);
                            sessionStorage.removeItem('previousPath'); // Clear stored path since we're navigating away
                            router.push("/sign-up/center");
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-primary/10 m-0"
                            variants={{
                              initial: {
                                clipPath: "circle(24px at 42px 50%)",
                                opacity: 0,
                              },
                              hover: {
                                clipPath: "circle(120% at 50% 50%)",
                                opacity: 1,
                              },
                            }}
                            transition={{
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          />

                          <motion.div
                            className="p-2 rounded-lg text-primary relative z-10"
                            variants={{
                              initial: { x: 0 },
                              hover: { x: 5 },
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Building2 className="h-6 w-6" />
                          </motion.div>

                          <div className="text-left flex-1 relative z-10">
                            <motion.h3
                              className="text-lg font-semibold text-foreground"
                              variants={{
                                initial: { x: 0 },
                                hover: { x: 3 },
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {t("sign-up.center.title")}
                            </motion.h3>
                          </div>

                          <motion.div
                            className="relative z-10"
                            variants={{
                              initial: { x: 0 },
                              hover: { x: 5 },
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ArrowLeft className="h-5 w-5 text-mid-gray ml-2 ltr:rotate-180" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Parent Account Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <motion.div
                        className="relative overflow-hidden rounded-lg"
                        whileHover="hover"
                        whileTap={{ scale: 0.98 }}
                        initial="initial"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full h-auto p-6 flex items-start space-x-4 hover:border-primary/50 transition-all duration-300 relative overflow-visible hover:!bg-transparent"
                          onClick={() => {
                            // Close modal and navigate to parent signup
                            globalModalState.setIsOpen(false);
                            sessionStorage.removeItem('previousPath'); // Clear stored path since we're navigating away
                            router.push("/sign-up/parent");
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-primary/10 m-0"
                            variants={{
                              initial: {
                                clipPath: "circle(24px at 42px 50%)",
                                opacity: 0,
                              },
                              hover: {
                                clipPath: "circle(120% at 50% 50%)",
                                opacity: 1,
                              },
                            }}
                            transition={{
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          />

                          <motion.div
                            className="p-2 rounded-lg text-primary relative z-10"
                            variants={{
                              initial: { x: 0 },
                              hover: { x: 5 },
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <UserRound className="h-6 w-6" />
                          </motion.div>

                          <div className="text-left flex-1 relative z-10">
                            <motion.h3
                              className="text-lg font-semibold text-foreground"
                              variants={{
                                initial: { x: 0 },
                                hover: { x: 3 },
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {t("sign-up.parent.title")}
                            </motion.h3>
                          </div>

                          <motion.div
                            className="relative z-10"
                            variants={{
                              initial: { x: 0 },
                              hover: { x: 5 },
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ArrowLeft className="h-5 w-5 text-mid-gray ml-2 ltr:rotate-180" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="mt-6 pt-4 border-t text-center text-sm">
                    {t("sign-up.have-account")}{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary hover:no-underline font-medium"
                      onClick={handleBackToSignIn}
                    >
                      {t("sign-up.sign-in")}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SignInModalHandler;
