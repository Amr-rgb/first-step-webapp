"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";

import FormNavigation from "@/components/forms/FormNavigation";
import StepIndicator from "@/components/forms/StepIndicator";
import { Icons } from "@/components/general/icons";
import { createSignUpCenterSchema, SignUpCenterFormData } from "@/lib/schemas";
import { Step1BasicInfo } from "@/components/forms/center/Step1";
import { Step2Documents } from "@/components/forms/center/Step2";

export function SignUp({
  submitHandler,
  isLoading,
  formRef,
}: {
  submitHandler: (data: SignUpCenterFormData) => void;
  isLoading: boolean;
  formRef: React.RefObject<UseFormReturn<SignUpCenterFormData> | null>;
}) {
  const t = useTranslations("auth.center-signup");
  const locale = useLocale();

  const steps = [
    { number: 1, label: t("1.title"), icon: Icons.one },
    { number: 2, label: t("2.title"), icon: Icons.two },
  ];

  const signUpCenterSchema = createSignUpCenterSchema(locale as "ar" | "en");

  const methods = useForm<SignUpCenterFormData>({
    resolver: zodResolver(signUpCenterSchema),
    defaultValues: {
      // step1
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      nursery_name: "",
      location: "",
      neighborhood: "",
      city: "",
      logo: undefined,
      nursery_type: [],
      // step2
      commercial_record_path: undefined,
      license_path: undefined,
    },
    mode: "onChange",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = steps.length;

  const goToNextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const isValid = await methods.trigger(fieldsToValidate as any);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsToValidate = (step: number) => {
    switch (step) {
      case 1:
        return [
          "name",
          "email",
          "password",
          "confirmPassword",
          "phone",
          "nursery_name",
          "location",
          "neighborhood",
          "city",
          "logo",
          "nursery_type",
        ];
      case 2:
        return ["commercial_record_path", "license_path"];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Documents />;
      default:
        return null;
    }
  };

  const onSubmit = (data: SignUpCenterFormData) => {
    submitHandler(data);
  };

  // Attach the ref to the form provider
  useEffect(() => {
    if (formRef) {
      formRef.current = methods;
    }
  }, [methods, formRef]);

  return (
    <div className="flex flex-col items-center container mx-auto px-4">
      <FormProvider {...methods}>
        <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <h1 className="mb-10 heading-2 text-primary text-center">
              {t("title")}
            </h1>
          )}

          <div className="p-5 sm:p-10 rounded-3xl border border-secondary-burgundy">
            <div className="w-full">
              <StepIndicator steps={steps} currentStep={currentStep} />
            </div>

            <div className="mt-40">{renderStep()}</div>

            {methods.formState.errors.root && (
              <div className="mt-4 text-center text-action">
                {methods.formState.errors.root.message}
              </div>
            )}

            <FormNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
              isLoading={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
