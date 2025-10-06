"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  // Content
  icon?: LucideIcon | string;
  image?: string;

  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  };

  // Styling
  size?: "sm" | "md" | "lg";
  className?: string;

  // Translation keys (if using translations)
  translationKey?: string;
}

const EmptyState = ({
  icon: Icon,
  image,
  primaryAction,
  secondaryAction,
  size = "md",
  className,
  translationKey,
}: EmptyStateProps) => {
  const t = useTranslations(translationKey || "common.emptyState");

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "py-8",
      icon: "w-12 h-12",
      title: "text-lg",
      description: "text-sm",
      spacing: "gap-3",
    },
    md: {
      container: "py-12",
      icon: "w-16 h-16",
      title: "text-xl",
      description: "text-base",
      spacing: "gap-4",
    },
    lg: {
      container: "py-16",
      icon: "w-20 h-20",
      title: "text-2xl",
      description: "text-lg",
      spacing: "gap-6",
    },
  };

  const config = sizeConfig[size];

  // Default content
  const defaultTitle = t("title");
  const defaultDescription = t("description");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        config.spacing,
        className
      )}
    >
      {/* Icon or Image */}
      <div className="flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            width={size === "sm" ? 48 : size === "md" ? 64 : 80}
            height={size === "sm" ? 48 : size === "md" ? 64 : 80}
            alt="Empty state"
            className="opacity-60"
          />
        ) : Icon ? (
          typeof Icon === "string" ? (
            <div className={cn("text-gray-400", config.icon)}>
              <span className="text-4xl">{Icon}</span>
            </div>
          ) : (
            <Icon className={cn("text-gray-400", config.icon)} />
          )
        ) : (
          <div className={cn("text-gray-400", config.icon)}>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto space-y-2">
        <h3 className={cn("font-semibold text-gray-900", config.title)}>
          {defaultTitle}
        </h3>
        <p className={cn("text-gray-500", config.description)}>
          {defaultDescription}
        </p>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || "default"}
              size={size === "sm" ? "sm" : "default"}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || "outline"}
              size={size === "sm" ? "sm" : "default"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
