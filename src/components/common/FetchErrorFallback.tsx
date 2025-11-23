"use client";

import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface FetchErrorFallbackProps {
  error: any;
  locale: string;
  className?: string;
}

export function FetchErrorFallback({
  error,
  locale,
  className = "",
}: FetchErrorFallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 space-y-6 ${className}`}
    >
      <AlertCircle className="w-16 h-16 text-destructive" />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-primary">
          {locale === "ar" ? "حدث خطأ في تحميل البيانات" : "Error Loading Data"}
        </h3>
        <p className="text-gray max-w-md">
          {error?.isNetworkError
            ? locale === "ar"
              ? "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
              : "Please check your internet connection and try again"
            : error?.message ||
              (locale === "ar"
                ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى"
                : "An unexpected error occurred. Please try again")}
        </p>
      </div>
      <Button onClick={handleRetry} className="gap-2">
        <RotateCw className="w-4 h-4" />
        {locale === "ar" ? "إعادة المحاولة" : "Retry"}
      </Button>
    </div>
  );
}
