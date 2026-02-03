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
        "relative flex items-center justify-between p-6 rounded-[24px] transition-all cursor-pointer border border-transparent",
        isSelected
          ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))] border-[#83CBAA]/20"
          : "bg-white hover:bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
      )}
    >
      {/* Selection/Design Indicator (Vertical line) */}
      <div
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-l-full transition-opacity",
          isSelected ? "bg-[#2D3A82] opacity-100" : "bg-gray-200 opacity-0",
        )}
      />

      {/* Title Section (Right in RTL) */}
      <h4 className="text-xl md:text-2xl font-bold text-[#2D3A82] flex-1 text-right">
        {title}
      </h4>

      {/* Duration Section (Middle) */}
      <div className="text-gray-400 text-lg font-medium flex-1 text-center">
        {durationLabel}
      </div>

      {/* Price Section (Left in RTL) */}
      <div className="flex flex-col items-end gap-1 flex-1">
        <span className="text-2xl font-bold text-[#2D3A82]">{price}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-[#2D3A82]">﷼</span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
