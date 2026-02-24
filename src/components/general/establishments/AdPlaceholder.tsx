"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toastSuccess, toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  variant: "top-left" | "top-right" | "bottom-small" | "bottom-medium" | "bottom-large";
  className?: string;
}

const AdPlaceholder = ({ variant, className }: AdPlaceholderProps) => {
  const t = useTranslations("adSection");
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const variants = {
    "top-left": {
      minHeight: "h-[200px]",
      textKey: "topPlaceholder",
    },
    "top-right": {
      minHeight: "h-[200px]",
      textKey: "topPlaceholder",
    },
    "bottom-small": {
      minHeight: "min-h-[180px]",
      textKey: "bottomPlaceholder",
    },
    "bottom-medium": {
      minHeight: "min-h-[200px]",
      textKey: "bottomPlaceholder",
    },
    "bottom-large": {
      minHeight: "min-h-[400px]",
      textKey: "bottomPlaceholder",
    },
  };

  const config = variants[variant];

  const handleClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toastError(t("errors.notSignedIn"));
      router.push(`/${locale}/sign-in`);
      return;
    }

    // Check if user is a center
    if (user?.role !== "center") {
      toastError(t("errors.centersOnly"));
      return;
    }

    // Redirect to ad request page
    router.push(`/${locale}/dashboard/nursery/ad-or-blog-request/ad-request`);

    toastSuccess(t("success.redirecting"));
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-2xl flex items-center justify-center p-4 w-full",
        "bg-[#FBFBFB] hover:bg-gray-100 active:scale-[0.98]",
        "cursor-pointer border-2 border-transparent hover:border-primary/20",
        "transition-all duration-200",
        config.minHeight,
        className
      )}
      aria-label={t(config.textKey)}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p
          className={cn(
            "font-tajawal leading-none text-xl lg:text-2xl font-normal text-[#8E8E8E]"
          )}
        >
          {t(config.textKey)}
        </p>
      </div>
    </button>
  );
};

export default AdPlaceholder;
