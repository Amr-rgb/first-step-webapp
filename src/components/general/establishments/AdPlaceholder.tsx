"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  variant: "top-left" | "top-right" | "bottom-small" | "bottom-medium" | "bottom-large";
  className?: string;
}

const AdPlaceholder = ({ variant, className }: AdPlaceholderProps) => {
  const t = useTranslations("adSection");

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

  return (
    <div
      className={cn(
        "rounded-2xl flex items-center justify-center p-4",
        "bg-[#FBFBFB]",
        config.minHeight,
        className
      )}
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
    </div>
  );
};

export default AdPlaceholder;
