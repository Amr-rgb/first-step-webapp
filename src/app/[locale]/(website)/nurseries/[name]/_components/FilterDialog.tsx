"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { X, MapPin, CalendarCheck, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branches: FilterOption[];
  programTypes: FilterOption[];
  ages: FilterOption[];
  selectedFilters: {
    branches: string[];
    programTypes: string[];
    ages: string[];
  };
  onApply: (filters: {
    branches: string[];
    programTypes: string[];
    ages: string[];
  }) => void;
  onReset: () => void;
}

const FilterDialog = ({
  isOpen,
  onClose,
  branches,
  programTypes,
  ages,
  selectedFilters,
  onApply,
  onReset,
}: FilterDialogProps) => {
  const t = useTranslations("nurseryDetails.programs");

  const [localFilters, setLocalFilters] = React.useState(selectedFilters);

  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(selectedFilters);
    }
  }, [isOpen, selectedFilters]);

  const toggleFilter = (category: keyof typeof localFilters, id: string) => {
    setLocalFilters((prev) => {
      const current = prev[category];
      if (id === "all") {
        return {
          ...prev,
          [category]: [],
        };
      }

      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      return {
        ...prev,
        [category]: next,
      };
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalFilters({ branches: [], programTypes: [], ages: [] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[32px] border-none bg-white">
        <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
          <DialogTitle className="text-3xl font-bold text-primary">
            {t("filter")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Branch Column */}
            <FilterColumn
              title={t("filters.branch")}
              icon={<MapPin className="w-5 h-5" />}
              options={branches}
              selectedIds={localFilters.branches}
              allLabel={t("filters.allBranches")}
              onChange={(id) => toggleFilter("branches", id)}
            />

            {/* Program Type Column */}
            <FilterColumn
              title={t("filters.programType")}
              icon={<CalendarCheck className="w-5 h-5" />}
              options={programTypes}
              selectedIds={localFilters.programTypes}
              allLabel={t("filters.allPrograms")}
              onChange={(id) => toggleFilter("programTypes", id)}
            />

            {/* Ages Column */}
            <FilterColumn
              title={t("filters.age")}
              icon={<Users className="w-5 h-5" />}
              options={ages}
              selectedIds={localFilters.ages}
              allLabel={t("filters.allAges")}
              onChange={(id) => toggleFilter("ages", id)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full md:flex-1 h-14 rounded-2xl text-gray-400 border-gray-200 text-lg font-bold hover:bg-gray-50"
            >
              {t("filters.reset")}
            </Button>
            <Button
              onClick={handleApply}
              className="w-full md:flex-1 h-14 rounded-2xl bg-[linear-gradient(90deg,#7082FF_0%,#2D3A82_100%)] text-white text-lg font-bold hover:opacity-90 transition-opacity border-none shadow-[0_4px_14px_rgba(45,58,130,0.3)]"
            >
              {t("filters.apply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FilterColumnProps {
  title: string;
  icon: React.ReactNode;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (id: string) => void;
  allLabel: string;
}

const FilterColumn = ({
  title,
  icon,
  options,
  selectedIds,
  onChange,
  allLabel,
}: FilterColumnProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-2 text-primary">
        <span className="text-xl font-bold">{title}</span>
        <div className="text-primary opacity-80">{icon}</div>
      </div>

      <div className="relative pr-4 min-h-[250px] max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-4">
        {/* Blue Indicator Line (Left in LTR, Right in RTL) */}
        <div className="absolute right-0 top-0 w-1 h-full bg-primary rounded-full opacity-100" />

        {/* "All" Option */}
        <div
          className="flex items-center justify-end gap-3 cursor-pointer group"
          onClick={() => onChange("all")}
        >
          <span
            className={cn(
              "text-lg font-medium transition-colors",
              selectedIds.length === 0
                ? "text-primary"
                : "text-gray-400 group-hover:text-gray-600",
            )}
          >
            {allLabel}
          </span>
          <div
            className={cn(
              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
              selectedIds.length === 0
                ? "bg-primary border-primary"
                : "border-gray-200 group-hover:border-gray-300",
            )}
          >
            {selectedIds.length === 0 && (
              <Check className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Dynamic Options */}
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <div
              key={option.id}
              className="flex items-center justify-end gap-3 cursor-pointer group"
              onClick={() => onChange(option.id)}
            >
              <span
                className={cn(
                  "text-lg font-medium transition-colors",
                  isSelected
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              >
                {option.label}
              </span>
              <div
                className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-gray-200 group-hover:border-gray-300",
                )}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterDialog;
