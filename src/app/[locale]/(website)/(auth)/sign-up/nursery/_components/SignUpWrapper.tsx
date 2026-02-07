"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { NurseryFormData } from "@/lib/schemas";
import { SignUpForm } from "./SignUpForm";
import LoadingOverlay from "@/components/forms/LoadingOverlay";
import { UseFormReturn } from "react-hook-form";
import { toastError } from "@/lib/toast";
import { ApiError } from "@/lib/error-handling";
import { trackSignUp } from "@/lib/snapchatPixel";

const SignUpWrapper = () => {
    const router = useRouter();
    const locale = useLocale();
    const formRef = useRef<UseFormReturn<NurseryFormData> | null>(null);
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
                { field: keyof NurseryFormData; step: number }
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
                album: { field: "album", step: 2 },

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

                    if (frontendField in formRef.current!.getValues()) {
                        formRef.current?.setError(frontendField, {
                            type: "server",
                            message: errorMessage,
                        });
                    }
                } else {
                    // Handle nested errors or unmapped fields
                    if (field.startsWith('plans')) {
                        // Example: plans.0.title
                        // Track step for plans
                        if (3 < earliestErrorStep) {
                            earliestErrorStep = 3;
                        }

                        // We can try to set error on the specific field if possible
                        // or just on 'plans' general
                        formRef.current?.setError("plans", {
                            type: "server",
                            message: errorMessage
                        });
                    } else {
                        console.warn(
                            `Field ${field} not found in form, showing as root error`
                        );
                        toastError("Validation Error", `${field}: ${errorMessage}`);
                    }
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
        any,
        ApiError,
        any
    >({
        mutationFn: async (data: any) => {
            // Use the newly created service method
            return await authService.registerNursery(data);
        },
        onSuccess: (data) => {
            // Track Sign Up
            trackSignUp({
                sign_up_method: "Nursery",
            });
            router.push(`/${locale}/sign-in`);
        },
        onError,
    });

    useEffect(() => {
        router.prefetch(`/${locale}/sign-in`);
    }, [locale, router]);

    const submitHandler = (data: NurseryFormData) => {
        // Clear any existing errors before submitting
        if (formRef.current) {
            formRef.current.clearErrors();
        }

        const expectedData = {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            nursery_name: data.nursery_name,
            description: data.description,
            logo: data.logo,
            album: data.album || [],
            plans: data.plans,
        };

        mutation.mutate(expectedData);
    };

    return (
        <div>
            {mutation.isSuccess && (
                <LoadingOverlay content="Welcome aboard! Let's get you signed in." />
            )}

            <SignUpForm
                formRef={formRef}
                currentStepRef={currentStepRef}
                submitHandler={submitHandler}
                isLoading={mutation.isPending}
            />
        </div>
    );
};

export default SignUpWrapper;
