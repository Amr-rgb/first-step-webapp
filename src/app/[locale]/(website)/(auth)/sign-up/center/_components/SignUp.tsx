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
import { Step2AgesAndHours } from "@/components/forms/center/Step2";
import { Step3Communication } from "@/components/forms/center/Step3";
import { Step4Permits } from "@/components/forms/center/Step4";

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
    {
      number: 3,
      label: t("3.title"),
      icon: Icons.three,
    },
    { number: 4, label: t("4.title"), icon: Icons.four },
  ];

  const signUpCenterSchema = createSignUpCenterSchema(locale as "ar" | "en");

  const methods = useForm<SignUpCenterFormData>({
    resolver: zodResolver(signUpCenterSchema),
    defaultValues: {
      // step1
      nursery_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      neighborhood: "",
      nursery_type: [],
      address: "",
      city: "",
      location: "",
      services: [],
      additional_service: "",
      // step2
      accepted_ages: [],
      // additionalInfo: "",
      work_days_from: "",
      work_days_to: "",
      work_hours_from: "",
      work_hours_to: "",
      // step3
      emergency_contact: undefined,
      communication_methods: [],
      meals_and_periods: {
        provides_food: "yes",
        first_meals: [{ meal_name: "", juice: "", components: "" }],
        second_meals: [{ meal_name: "", juice: "", components: "" }],
        time_of_first_period: "",
        time_of_second_period: "",
      },
      // step4
      license_path: undefined,
      commercial_record_path: undefined,
      logo: undefined,
      // comments: "",
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
          "nursery_name",
          "email",
          "phone",
          "city",
          "neighborhood",
          "address",
          "location",
          "nursery_type",
          "services",
          "additional_service",
        ];
      case 2:
        return [
          "accepted_ages",
          "work_days_from",
          "work_days_to",
          "work_hours_from",
          "work_hours_to",
        ];
      case 3:
        return [
          "emergency_contact",
          "communication_methods",
          "meals_and_periods",
        ];
      case 4:
        return ["businessLicense", "commercialRegistration"];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2AgesAndHours />;
      case 3:
        return <Step3Communication />;
      case 4:
        return <Step4Permits />;
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
