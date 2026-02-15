"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { SignInFormData } from "@/lib/schemas";
import LoadingOverlay from "@/components/forms/LoadingOverlay";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/error-handling";

const SignIn = () => {
  const router = useRouter();
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
      } else if (data.user.role === "branch_admin") {
        dashboardPath = data.user.center_id ? "/dashboard/center" : "/dashboard/nursery";
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

  return (
    <div className="px-5 sm:px-10  pb-20">
      {mutation.isSuccess && <LoadingOverlay content={t("sign-in.loading")} />}

      <div className="flex flex-col items-center gap-y-12">
        <Image
          src="/assets/logos/logo.svg"
          alt="First Step Logo"
          width={64.09}
          height={80}
        />

        <div className="flex flex-col w-full max-w-[41.25rem]">
          <h1 className="heading-3 text-center text-primary">
            {t("sign-in.title")}
          </h1>

          <div className="mt-9 flex flex-col gap-y-6">
            <SignInForm
              onSubmit={onSubmit}
              isLoading={mutation.isPending || mutation.isSuccess}
              formRef={formRef}
            />
          </div>

          <div className="mt-12 flex flex-col items-center gap-y-4">
            <p className="text-mid-gray text-center text-lg">
              {t("sign-in.no-account")}{" "}
              <Link
                href={"/sign-up"}
                className="text-primary font-bold hover:underline transition-all duration-300"
              >
                {t("buttons.sign-up")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
