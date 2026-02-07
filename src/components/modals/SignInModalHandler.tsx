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
import SendEmailForm from "@/app/[locale]/(website)/(auth)/(password)/_components/SendEmailForm";
import SendOTPForm from "@/app/[locale]/(website)/(auth)/(password)/_components/SendOTPForm";
import ResetPasswordForm from "@/app/[locale]/(website)/(auth)/(password)/_components/ResetPasswordForm";
import { SignInFormData } from "@/lib/schemas";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ApiError } from "@/lib/error-handling";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, UserRound, X, ArrowLeft, School, GraduationCap, BookOpen } from "lucide-react";

type ViewType =
  | "signin"
  | "account-type"
  | "forgot-password"
  | "otp-verification"
  | "reset-password";

// Create a global state for the modal
let globalModalState = {
  isOpen: false,
  setIsOpen: (open: boolean) => {
    globalModalState.isOpen = open;
    // Trigger re-render for all modal instances
    window.dispatchEvent(
      new CustomEvent("signInModalToggle", { detail: { isOpen: open } })
    );
  },
};

// Export function to open modal from anywhere
export const openSignInModal = () => {
  // Store current path for returning to it later
  const currentPath = window.location.pathname;
  sessionStorage.setItem("previousPath", currentPath);

  // Extract locale from current path (e.g., /en/contact -> en)
  const localeMatch = currentPath.match(/^\/(en|ar)/);
  const locale = localeMatch ? localeMatch[1] : "en";

  // Update URL to locale-specific sign-in route
  const signInPath = `/${locale}/sign-in`;
  if (currentPath !== signInPath) {
    window.history.pushState(null, "", signInPath);
  }

  globalModalState.setIsOpen(true);
};

const SignInModalHandler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("signin");
  const [resetEmail, setResetEmail] = useState<string>("");
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
      // Use setUserToken to properly set both state and cookies
      useAuthStore.getState().setUserToken(data.user, data.token);

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
      const storedPath = sessionStorage.getItem("previousPath");
      if (storedPath) {
        // Navigate back to the stored previous path
        window.history.replaceState(null, "", storedPath);
        sessionStorage.removeItem("previousPath");
      } else {
        // Fallback: remove /sign-in from current URL
        const currentPath = window.location.pathname;
        if (currentPath.includes("/sign-in")) {
          const localeMatch = currentPath.match(/^\/(en|ar)/);
          const locale = localeMatch ? localeMatch[1] : "en";
          window.history.replaceState(null, "", `/${locale}`);
        }
      }

      globalModalState.setIsOpen(false);
    }
  };

  // Listen for global modal state changes
  useEffect(() => {
    const handleModalToggle = (event: CustomEvent) => {
      // Don't show modal if we're already on the sign-in page route
      if (pathname === "/sign-in") {
        return;
      }

      setIsOpen(event.detail.isOpen);
      if (event.detail.isOpen) {
        setCurrentView("signin");
      }
    };

    window.addEventListener(
      "signInModalToggle",
      handleModalToggle as EventListener
    );

    // Check for direct navigation to sign-in routes
    // Only show modal if we're on a sign-in URL but NOT on the actual sign-in page
    if (pathname.includes("sign-in") && pathname !== "/sign-in") {
      globalModalState.setIsOpen(true);
    }

    globalModalState.setIsOpen(false);

    return () => {
      window.removeEventListener(
        "signInModalToggle",
        handleModalToggle as EventListener
      );
    };
  }, [pathname]);

  const handleBackToSignIn = () => {
    setCurrentView("signin");
  };

  // Password reset flow handlers
  const handleForgotPassword = () => {
    setCurrentView("forgot-password");
  };

  const handleEmailSent = (email: string) => {
    setResetEmail(email);
    setCurrentView("otp-verification");
  };

  const handleOTPVerified = () => {
    setCurrentView("reset-password");
  };

  const handlePasswordReset = () => {
    // After successful password reset, go back to sign in
    setCurrentView("signin");
    setResetEmail(""); // Clear email
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
                      onForgotPassword={handleForgotPassword}
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
              ) : currentView === "forgot-password" ? (
                <>
                  <DialogHeader>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-2"
                      onClick={handleBackToSignIn}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-center text-2xl font-bold text-primary">
                      {t("forgot-password.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <SendEmailForm onSuccess={handleEmailSent} />
                  </div>
                </>
              ) : currentView === "otp-verification" ? (
                <>
                  <DialogHeader>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-2"
                      onClick={() => setCurrentView("forgot-password")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-center text-2xl font-bold text-primary">
                      {t("otp.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <SendOTPForm
                      email={resetEmail}
                      onSuccess={handleOTPVerified}
                    />
                  </div>
                </>
              ) : currentView === "reset-password" ? (
                <>
                  <DialogHeader>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-2"
                      onClick={() => setCurrentView("otp-verification")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-center text-2xl font-bold text-primary">
                      {t("reset-password.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <ResetPasswordForm
                      email={resetEmail}
                      onSuccess={handlePasswordReset}
                    />
                  </div>
                </>
              ) : currentView === "account-type" ? (
                <>
                  <DialogHeader className="relative pb-2">
                    <DialogTitle className="text-center text-2xl font-bold text-foreground">
                      {t("sign-up.select-account-type")}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center mt-2 max-w-[80%] mx-auto">
                      {t("sign-up.select-account-description")}
                    </p>
                  </DialogHeader>

                  <div className="mt-6 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto px-1 pb-1">
                    {/* Roles List */}
                    {[
                      {
                        id: "parent",
                        title: t("sign-up.parent.title"),
                        icon: UserRound,
                        href: "/sign-up/parent",
                        color: "text-primary",
                        bgColor: "bg-primary/10",
                      },
                      {
                        id: "nursery",
                        title: t("sign-up.nursery.title"),
                        icon: School,
                        href: "/sign-up/nursery",
                        color: "text-secondary-orange",
                        bgColor: "bg-secondary-orange/10",
                      },
                      {
                        id: "rehab-center",
                        title: t("sign-up.rehab-center.title"),
                        icon: Building2,
                        href: "/sign-up/center",
                        color: "text-secondary-purple",
                        bgColor: "bg-secondary-purple/10",
                      },
                      {
                        id: "mentor",
                        title: t("sign-up.mentor.title"),
                        icon: GraduationCap,
                        href: "#",
                        soon: true,
                        color: "text-blue-500",
                        bgColor: "bg-blue-500/10",
                      },
                      {
                        id: "teacher",
                        title: t("sign-up.teacher.title"),
                        icon: BookOpen,
                        href: "#",
                        soon: true,
                        color: "text-green-500",
                        bgColor: "bg-green-500/10",
                      },
                    ].map((role, index) => (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={index === 2 ? "col-span-2" : ""} // Make center full width if odd count? Nah, let's keep grid. Maybe span 2 for the 3rd item if we want symmetry with 5 items. Let's try to keep it simple first. Actually, 5 items in 2 cols leaves one hanging. Let's make the 3rd item (Rehab) span 2 cols to emphasize it? Or maybe the list order. Parent/Nursery (top), Center (middle), Mentor/Teacher (bottom). Layout: 2, 1, 2.
                      >
                        <motion.div
                          className="relative h-full"
                          whileHover={!role.soon ? "hover" : undefined}
                          whileTap={!role.soon ? { scale: 0.98 } : undefined}
                          initial="initial"
                        >
                          <Button
                            variant="outline"
                            className={`w-full h-full min-h-[140px] p-4 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group ${role.soon ? "opacity-70 cursor-default" : ""
                              }`}
                            onClick={() => {
                              if (role.soon) return;
                              globalModalState.setIsOpen(false);
                              sessionStorage.removeItem("previousPath");
                              router.push(role.href);
                            }}
                          >
                            {/* Background Hover Effect */}
                            {!role.soon && (
                              <motion.div
                                className={`absolute inset-0 ${role.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                              />
                            )}

                            {/* Icon Container */}
                            <div className={`p-3 rounded-full ${role.bgColor} ${role.color} relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                              <role.icon className="h-6 w-6" />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col items-center gap-1 relative z-10">
                              <span className="font-semibold text-foreground text-center text-sm break-words whitespace-normal leading-tight">
                                {role.title}
                              </span>
                            </div>

                            {/* Soon Badge */}
                            {role.soon && (
                              <div className="absolute top-2 right-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                                  {t("sign-up.mentor.soon")}
                                </span>
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
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
              ) : null}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SignInModalHandler;
