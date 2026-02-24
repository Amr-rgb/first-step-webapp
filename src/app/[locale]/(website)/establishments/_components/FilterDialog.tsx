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
import { dashboardIcons } from "@/components/general/icons";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branches: FilterOption[];
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
  tNamespace?: string;
}

const FilterDialog = ({
  isOpen,
  onClose,
  branches,
  selectedFilters,
  onApply,
  onReset,
  tNamespace = "nurseryDetails",
}: FilterDialogProps) => {
  const t = useTranslations(`${tNamespace}.programs` as any);

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
      <DialogContent className="w-[95vw] sm:max-w-4xl p-0 overflow-hidden rounded-3xl border-none bg-white max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 pb-2 flex flex-row items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <DialogTitle className="text-2xl sm:text-4xl font-bold text-primary">
            {t("filter")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 sm:hidden"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Branch Column */}
            <div className="md:px-4 md:border-r md:border-light-gray/50 md:last:border-r-0 md:rtl:border-r-0 md:rtl:border-l md:rtl:first:border-l-0">
              <FilterColumn
                title={t("filters.branch")}
                icon={<dashboardIcons.branch className="w-5 h-5" />}
                options={branches}
                selectedIds={localFilters.branches}
                allLabel={t("filters.allBranches")}
                onChange={(id) => toggleFilter("branches", id)}
              />
            </div>

            {/* Program Type Column */}
            <div className="md:px-4 md:border-r md:border-light-gray/50 md:last:border-r-0 md:rtl:border-r-0 md:rtl:border-l md:rtl:first:border-l-0 border-t md:border-t-0 border-light-gray/20">
              <FilterColumn
                title={t("filters.programType")}
                icon={<dashboardIcons.programType className="w-5 h-5" />}
                options={[
                  { id: "hour", label: t("filters.types.hour") },
                  { id: "day", label: t("filters.types.day") },
                  { id: "week", label: t("filters.types.week") },
                  { id: "month", label: t("filters.types.month") },
                  { id: "year", label: t("filters.types.year") },
                ]}
                selectedIds={localFilters.programTypes}
                allLabel={t("filters.allPrograms")}
                onChange={(id) => toggleFilter("programTypes", id)}
              />
            </div>

            {/* Ages Column */}
            <div className="border-t md:border-t-0 border-light-gray/20">
              <FilterColumn
                title={t("filters.age")}
                icon={<dashboardIcons.ages className="w-5 h-5" />}
                options={[
                  {
                    id: "0_6_months",
                    label: t("filters.ages_list.0_6_months"),
                  },
                  {
                    id: "6_12_months",
                    label: t("filters.ages_list.6_12_months"),
                  },
                  { id: "1_3_years", label: t("filters.ages_list.1_3_years") },
                  { id: "3_5_years", label: t("filters.ages_list.3_5_years") },
                ]}
                selectedIds={localFilters.ages}
                allLabel={t("filters.allAges")}
                onChange={(id) => toggleFilter("ages", id)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-4 sm:pt-0 border-t border-gray-100 bg-white shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Button
              size="long"
              variant="outline"
              className="sm:flex-1 border-light-gray! text-mid-gray!"
              onClick={handleReset}
            >
              {t("filters.reset")}
            </Button>
            <Button size="long" className="sm:flex-1" onClick={handleApply}>
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
      <div className="flex items-center justify-start gap-2 text-primary">
        <div className="text-primary opacity-80">{icon}</div>
        <span className="heading-4 font-bold">{title}</span>
      </div>

      <div className="relative pr-4 max-h-[225px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
        {/* "All" Option */}
        <div
          className="flex items-center justify-start gap-3 cursor-pointer group"
          onClick={() => onChange("all")}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
              selectedIds.length === 0
                ? "border-primary bg-white shadow-sm"
                : "border-gray-200 group-hover:border-gray-300",
            )}
          >
            {selectedIds.length === 0 && (
              <Check className="w-4 h-4 text-primary stroke-[3.5px]" />
            )}
          </div>
          <span
            className={cn(
              "font-medium transition-colors",
              selectedIds.length === 0
                ? "text-gray"
                : "text-mid-gray group-hover:text-gray",
            )}
          >
            {allLabel}
          </span>
        </div>

        {/* Dynamic Options */}
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <div
              key={option.id}
              className="flex items-center justify-start gap-3 cursor-pointer group"
              onClick={() => onChange(option.id)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-white"
                    : "border-gray-200 group-hover:border-gray-300",
                )}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-primary stroke-[3.5px]" />
                )}
              </div>
              <span
                className={cn(
                  "font-medium transition-colors",
                  isSelected
                    ? "text-gray"
                    : "text-mid-gray group-hover:text-gray",
                )}
              >
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterDialog;
