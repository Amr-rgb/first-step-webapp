import React from "react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  title: string;
  durationLabel: string;
  price: string | number;
  currencySymbol?: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const PlanCard = ({
  title,
  durationLabel,
  price,
  isSelected,
  className,
  children,
  onClick,
}: PlanCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white p-6 rounded-2xl text-center space-y-3 transition-all",
        isSelected
          ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))]"
          : "shadow-[0_2px_80px_rgba(34,34,34,0.08)]",
        className
      )}
    >
      <h4 className="font-bold text-primary text-xl truncate" title={title}>
        {title}
      </h4>
      <p className="text-base text-gray-500">{durationLabel}</p>
      <div className="flex items-center justify-center gap-1 overflow-hidden">
        <span className="text-3xl font-bold text-primary truncate">
          {typeof price === "string" ? parseFloat(price) : price}
        </span>
        <span className="sar text-2xl text-primary">$</span>
      </div>
      {children}
    </div>
  );
};
