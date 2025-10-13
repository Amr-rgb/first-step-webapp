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

const SignUpWrapper = () => {
  const router = useRouter();
  const locale = useLocale();
  const formRef = useRef<UseFormReturn<SignUpCenterFormData> | null>(null);

  const onError = (error: ApiError) => {
    console.log("Full API Error:", error);

    if (!formRef.current) return;

    // Clear any existing errors first
    formRef.current.clearErrors();

    // Handle field-specific validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      console.log("Field-specific errors:", error.errors);

      Object.entries(error.errors).forEach(([field, messages]) => {
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;

        // Map backend field names to frontend field names if needed
        const fieldMapping: Record<string, keyof SignUpCenterFormData> = {
          name: "name",
          email: "email",
          password: "password",
          phone: "phone",
          nursery_name: "nursery_name",
          location: "location",
          neighborhood: "neighborhood",
          city: "city",
          city_id: "city",
          logo: "logo",
          nursery_type: "nursery_type",
          commercial_record_path: "commercial_record_path",
          license_path: "license_path",
          notes: "notes",
        };

        const frontendField =
          fieldMapping[field] || (field as keyof SignUpCenterFormData);

        // Check if the field exists in our form
        if (frontendField in formRef.current!.getValues()) {
          formRef.current?.setError(frontendField, {
            type: "server",
            message: errorMessage,
          });
        } else {
          // If field doesn't exist in form, show as root error
          console.warn(
            `Field ${field} not found in form, showing as root error`
          );
          formRef.current?.setError("root", {
            type: "server",
            message: `${field}: ${errorMessage}`,
          });

          // Also show as toast for better visibility
          toastError("Validation Error", `${field}: ${errorMessage}`);
        }
      });
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
        submitHandler={submitHandler}
        isLoading={mutation.isPending}
      />
    </div>
  );
};

export default SignUpWrapper;
