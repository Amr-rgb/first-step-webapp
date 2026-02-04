"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  title: string;
  durationLabel: string;
  price: string | number;
  isSelected?: boolean;
  onClick?: () => void;
}

const ProgramCard = ({
  title,
  durationLabel,
  price,
  isSelected,
  onClick,
}: ProgramCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white px-2 py-4 rounded-2xl flex items-center justify-between transition-all duration-500 cursor-pointer",
        isSelected
          ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))]"
          : "hover:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))]",
      )}
    >
      <h4 className="flex-1 font-bold text-lg truncate" title={title}>
        {title}
      </h4>

      <div className="flex-1 flex items-center justify-between">
        <p className="text-base text-mid-gray font-medium">{durationLabel}</p>

        <div className="flex flex-col items-center justify-center gap-1 overflow-hidden">
          <span className="text-lg md:text-xl font-bold text-primary truncate">
            {price}
          </span>
          <span className="sar text-2xl text-primary">$</span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
