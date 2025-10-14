"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { UseFormReturn } from "react-hook-form";
import { transformParentDataToExpectedPayload } from "@/lib/utils";
import { ParentRegisterFormDataInput, ParentRegisterPayload } from "@/types";
import SignUp from "./SignUp";
import { SignUpParentFormData } from "@/lib/schemas";
import LoadingOverlay from "@/components/forms/LoadingOverlay";
import { ApiError } from "@/lib/error-handling";

const SignUpWrapper = () => {
  const router = useRouter();
  const locale = useLocale();
  const formRef = useRef<UseFormReturn<SignUpParentFormData> | null>(null);
  const t = useTranslations("auth.parent-signup");

  const onError = (error: ApiError) => {
    if (!formRef.current) return;

    // Clear any existing errors first
    formRef.current.clearErrors();

    // Handle field-specific validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        // Map API field names to form field names
        let formField = mapApiFieldToFormField(field);
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;

        if (formField) {
          // Set the error on the mapped form field
          formRef.current?.setError(formField as keyof SignUpParentFormData, {
            type: "server",
            message: errorMessage,
          });
        } else {
          // If we can't map the field, show it as a root error with a user-friendly message
          formRef.current?.setError("root", {
            type: "server",
            message: getFieldErrorMessage(field, errorMessage),
          });
        }
      });
    } else if (error.message) {
      // If there's a general error message, show it at the root level
      formRef.current.setError("root", {
        type: "server",
        message: error.message,
      });
    }
  };

  // Helper function to map API field names to form field names
  const mapApiFieldToFormField = (apiField: string): string | null => {
    const fieldMappings: Record<string, string> = {
      name: "name",
      email: "email",
      password: "password",
      address: "address",
      national_number: "nationalNumber",
      phone: "phone",
      "children.0.child_name": "childName",
      "children.0.birthday_date": "birthDate",
      "children.0.gender": "gender",
      "children.0.parent_name": "fatherName",
      "children.0.mother_name": "motherName",
      "children.0.kinship": "kinship",
      "children.0.description_3_words": "childDescription",
      "children.0.things_child_likes": "favoriteThings",
      "children.0.recommendations": "recommendations",
      "children.0.notes": "comments",
    };

    return fieldMappings[apiField] || null;
  };

  // Helper function to generate user-friendly error messages for unmapped fields
  const getFieldErrorMessage = (
    apiField: string,
    originalMessage: string
  ): string => {
    const fieldMessages: Record<string, string> = {
      "children.0.disease_details":
        t("errors.chronicDiseases") ||
        "Please check the chronic diseases information",
      "children.0.disease":
        t("errors.chronicDiseases") ||
        "Please check the chronic diseases information",
      "children.0.allergy":
        t("errors.allergies") || "Please check the allergies information",
    };

    return fieldMessages[apiField] || originalMessage;
  };

  // --- Data Fetching & Mutation ---
  const mutation = useMutation<
    any, // Success response type (update this based on your API response)
    ApiError,
    ParentRegisterFormDataInput
  >({
    mutationFn: async (originalData: ParentRegisterFormDataInput) => {
      const payload: ParentRegisterPayload =
        transformParentDataToExpectedPayload(originalData);
      return await authService.registerParent(payload);
    },
    onSuccess: (data) => {
      router.push(`/${locale}/sign-in`);
    },
    onError,
  });

  useEffect(() => {
    router.prefetch(`/${locale}/sign-in`);
  }, [locale, router]);

  const submitHandler = (data: any) => {
    // Clear any existing errors before submitting
    if (formRef.current) {
      formRef.current.clearErrors();
    }
    mutation.mutate(data);
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
