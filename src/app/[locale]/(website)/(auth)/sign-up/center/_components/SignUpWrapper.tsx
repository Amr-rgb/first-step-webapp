"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { CenterFormData } from "@/lib/schemas";
import { CenterRegisterPayload } from "@/types";
import { SignUp } from "./SignUp";
import LoadingOverlay from "@/components/forms/LoadingOverlay";
import { UseFormReturn } from "react-hook-form";
import { toastError } from "@/lib/toast";
import { ApiError } from "@/lib/error-handling";
import { trackSignUp } from "@/lib/snapchatPixel";

const SignUpWrapper = () => {
  const router = useRouter();
  const locale = useLocale();
  const formRef = useRef<UseFormReturn<CenterFormData> | null>(null);
  const currentStepRef = useRef<{
    currentStep: number;
    setCurrentStep: (step: number) => void;
  } | null>(null);

  const onError = (error: ApiError) => {
    console.log("Full API Error:", error);

    if (!formRef.current) return;

    // Clear any existing errors first
    formRef.current.clearErrors();

    // Handle field-specific validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      console.log("Field-specific errors:", error.errors);

      // Map backend field names to frontend field names and their steps
      const fieldMapping: Record<
        string,
        { field: keyof CenterFormData; step: number }
      > = {
        // Step 1
        name: { field: "name", step: 1 },
        email: { field: "email", step: 1 },
        password: { field: "password", step: 1 },
        phone: { field: "phone", step: 1 },
        nursery_name: { field: "nursery_name", step: 1 },
        description: { field: "description", step: 1 },
        logo: { field: "logo", step: 1 },

        // Step 2
        experience_years: { field: "experience_years", step: 2 },
        children_served_count: { field: "children_served_count", step: 2 },
        specialists_count: { field: "specialists_count", step: 2 },
        custom_services: { field: "custom_services", step: 2 },

        // Step 3
        plans: { field: "plans", step: 3 },
      };

      let earliestErrorStep = Infinity;

      Object.entries(error.errors).forEach(([field, messages]) => {
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;
        const mappedField = fieldMapping[field];

        if (mappedField) {
          const { field: frontendField, step } = mappedField;

          // Track the earliest step with an error
          if (step < earliestErrorStep) {
            earliestErrorStep = step;
          }

          // Check if the field exists in our form
          if (frontendField in formRef.current!.getValues()) {
            formRef.current?.setError(frontendField, {
              type: "server",
              message: errorMessage,
            });
          } else {
            // Handle array fields or nested errors specifically if needed
            // For now fall back to root
            console.warn(
              `Field ${field} not found directly in form values, showing as root error`
            );
            formRef.current?.setError("root", {
              type: "server",
              message: `${field}: ${errorMessage}`,
            });
            toastError("Validation Error", `${field}: ${errorMessage}`);
          }
        } else {
          // Unknown field, show as root error
          console.warn(`Field ${field} not mapped, showing as root error`);
          formRef.current?.setError("root", {
            type: "server",
            message: `${field}: ${errorMessage}`,
          });
          toastError("Validation Error", `${field}: ${errorMessage}`);
        }
      });

      // Navigate to the earliest step with errors if we're not already there
      if (
        earliestErrorStep !== Infinity &&
        currentStepRef.current &&
        currentStepRef.current.currentStep !== earliestErrorStep
      ) {
        currentStepRef.current.setCurrentStep(earliestErrorStep);
        toastError(
          locale === "ar" ? "خطأ في التحقق" : "Validation Error",
          locale === "ar"
            ? "يرجى التحقق من الحقول"
            : "Please check the fields"
        );
      }
    } else {
      // If no specific field errors, show the main error message
      formRef.current?.setError("root", {
        type: "server",
        message: error.message || "An error occurred. Please try again.",
      });

      // Also show as toast for better visibility
      toastError(
        "Registration Failed",
        error.message || "An error occurred. Please try again."
      );
    }
  };

  // --- Data Fetching & Mutation ---
  const mutation = useMutation<
    any, // Success response type (update this based on your API response)
    ApiError,
    any
  >({
    mutationFn: async (data: any) => {
      return await authService.registerCenter(data);
    },
    onSuccess: (data) => {
      // Track Sign Up
      trackSignUp({
        sign_up_method: "Center",
      });
      router.push(`/${locale}/sign-in`);
    },
    onError,
  });

  useEffect(() => {
    router.prefetch(`/${locale}/sign-in`);
  }, [locale, router]);

  const submitHandler = (data: CenterFormData) => {
    // Clear any existing errors before submitting
    if (formRef.current) {
      formRef.current.clearErrors();
    }

    const expectedData: CenterRegisterPayload = {
      // Basic fields
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nursery_name: data.nursery_name,
      description: data.description,
      logo: data.logo,

      // Stats
      experience_years: data.experience_years,
      children_served_count: data.children_served_count,
      specialists_count: data.specialists_count,

      // Services & Plans
      custom_services: data.custom_services,
      plans: data.plans,
    };

    mutation.mutate(expectedData);
  };

  return (
    <div>
      {mutation.isSuccess && (
        <LoadingOverlay content="Welcome aboard! Let's get you signed in." />
      )}

      <SignUp
        formRef={formRef}
        currentStepRef={currentStepRef}
        submitHandler={submitHandler}
        isLoading={mutation.isPending}
      />
    </div>
  );
};

export default SignUpWrapper;
