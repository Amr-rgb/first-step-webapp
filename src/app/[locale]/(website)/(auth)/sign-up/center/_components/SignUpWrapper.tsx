"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { SignUpCenterFormData } from "@/lib/schemas";
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
  const formRef = useRef<UseFormReturn<SignUpCenterFormData> | null>(null);
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
        { field: keyof SignUpCenterFormData; step: number }
      > = {
        name: { field: "name", step: 1 },
        email: { field: "email", step: 1 },
        password: { field: "password", step: 1 },
        phone: { field: "phone", step: 1 },
        nursery_name: { field: "nursery_name", step: 1 },
        location: { field: "location", step: 1 },
        neighborhood: { field: "neighborhood", step: 1 },
        city: { field: "city", step: 1 },
        city_id: { field: "city", step: 1 },
        logo: { field: "logo", step: 1 },
        nursery_type: { field: "nursery_type", step: 1 },
        commercial_record_path: {
          field: "commercial_record_path",
          step: 2,
        },
        license_path: { field: "license_path", step: 2 },
        notes: { field: "notes", step: 2 },
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
            console.warn(
              `Field ${field} not found in form, showing as root error`
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
            ? "يرجى التحقق من الحقول في الخطوة السابقة"
            : "Please check the fields in the previous step"
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
        // Center sign up might behave differently, check data structure if available, or just generic
        // Assuming data returned might adhere to similar structure or we just track event
      });
      router.push(`/${locale}/sign-in`);
    },
    onError,
  });

  useEffect(() => {
    router.prefetch(`/${locale}/sign-in`);
  }, [locale, router]);

  const submitHandler = (data: SignUpCenterFormData) => {
    // Clear any existing errors before submitting
    if (formRef.current) {
      formRef.current.clearErrors();
    }

    const expectedData = {
      // Step 1 fields
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nursery_name: data.nursery_name,
      location: data.location,
      neighborhood: data.neighborhood,
      city: data.city,
      logo: data.logo,
      nursery_type: data.nursery_type,

      // Step 2 fields
      commercial_record_path: data.commercial_record_path,
      license_path: data.license_path,
      notes: data.notes,
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
