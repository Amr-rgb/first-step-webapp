"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLoading,
}: FormNavigationProps) {
  const t = useTranslations("auth.buttons");

  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-x-9 gap-y-2.5">
      {currentStep > 1 ? (
        <Button
          type="button"
          size={"lg"}
          variant="outline"
          onClick={onPrevious}
          className="!border-light-gray text-mid-gray w-full sm:w-auto"
          disabled={isLoading}
        >
          {t("previous")}
        </Button>
      ) : null}

      {currentStep < totalSteps ? (
        <Button
          className="w-full sm:w-auto"
          type="button"
          size={"lg"}
          onClick={onNext}
          disabled={isLoading}
        >
          {isLoading && (
            <div className="h-4 w-4 bg-white/20 rounded animate-pulse mr-2.5" />
          )}
          {t("next")}
        </Button>
      ) : (
        <Button
          className="w-full sm:w-auto"
          type="submit"
          size={"lg"}
          disabled={isLoading}
        >
          {isLoading && (
            <div className="h-4 w-4 bg-white/20 rounded animate-pulse mr-2.5" />
          )}
          {t("sign-up")}
        </Button>
      )}
    </div>
  );
}
