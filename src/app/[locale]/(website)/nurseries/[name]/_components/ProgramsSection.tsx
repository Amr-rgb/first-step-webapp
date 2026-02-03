"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getBranchesForCenterAction,
  getBranchPricingAction,
} from "@/actions/nurseryActions";
import ProgramCard from "./ProgramCard";
import FilterDialog from "./FilterDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgramsSectionProps {
  centerId: string;
  nurseryName: string;
  locale: string;
}

const ProgramsSection = ({
  centerId,
  nurseryName,
  locale,
}: ProgramsSectionProps) => {
  const t = useTranslations("nurseryDetails.programs");
  const tCommon = useTranslations("nurseryDetails.plans"); // Reuse units if needed

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );

  // Filter state
  const [filters, setFilters] = useState({
    branches: [] as string[],
    programTypes: [] as string[],
    ages: [] as string[],
  });

  // Fetch Branches
  const { data: branchesResponse, isLoading: loadingBranches } = useQuery({
    queryKey: ["branches-for-center", centerId],
    queryFn: () => getBranchesForCenterAction(centerId),
    enabled: !!centerId,
  });

  const branches = useMemo(() => {
    return (branchesResponse?.data || []).map((b: any) => ({
      id: String(b.id),
      label: b.nursery_name || b.name || "Branch",
    }));
  }, [branchesResponse]);

  // Fetch all plans for all branches (to support cross-branch filtering)
  const branchIds = useMemo(() => branches.map((b) => b.id), [branches]);

  // For simplicity, we fetch pricing for the first branch or selected branches
  // In a real scenario, we might want a "get all pricing" endpoint if available
  // Here we use the first branch if none selected, or fetch matching branches
  const activeBranchIds =
    filters.branches.length > 0
      ? filters.branches
      : branchIds.length > 0
        ? [branchIds[0]]
        : [];

  const { data: allPlans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["branch-pricing-all", activeBranchIds, centerId],
    queryFn: async () => {
      // If many branches, we might want to optimize. For now, we fetch for active ones.
      const results = await Promise.all(
        activeBranchIds.map((id) => getBranchPricingAction(id, centerId)),
      );
      return results.flat();
    },
    enabled: activeBranchIds.length > 0,
  });

  // Derived Filter Options
  const programTypes = useMemo(() => {
    const types = new Set<string>();
    allPlans.forEach((p) => types.add(p.enrollment_type));
    return Array.from(types).map((type) => ({
      id: type,
      label: t(`filters.types.${type}`) || type,
    }));
  }, [allPlans, t]);

  const ageOptions = useMemo(() => {
    const ranges = new Set<string>();
    allPlans.forEach((p) => {
      const sAge =
        typeof p.start_age === "number" ? p.start_age : p.start_age.age;
      const sType = typeof p.start_age === "number" ? "year" : p.start_age.type;
      const eAge = typeof p.end_age === "number" ? p.end_age : p.end_age.age;
      const eType = typeof p.end_age === "number" ? "year" : p.end_age.type;
      ranges.add(`${sAge}_${sType}_${eAge}_${eType}`);
    });

    const getUnitLabel = (type: string) => tCommon(`units.${type}`) || type;

    return Array.from(ranges).map((range) => {
      const [start, startType, end, endType] = range.split("_");
      return {
        id: range,
        label:
          locale === "ar"
            ? `من ${start} ${getUnitLabel(startType)} ل ${end} ${getUnitLabel(endType)}`
            : `From ${start} ${getUnitLabel(startType)} to ${end} ${getUnitLabel(endType)}`,
      };
    });
  }, [allPlans, tCommon, locale]);

  // Filtering Logic
  const filteredPrograms = useMemo(() => {
    return allPlans.filter((p) => {
      // Filter by Type
      if (
        filters.programTypes.length > 0 &&
        !filters.programTypes.includes(p.enrollment_type)
      ) {
        return false;
      }

      // Filter by Age
      if (filters.ages.length > 0) {
        const sAge =
          typeof p.start_age === "number" ? p.start_age : p.start_age.age;
        const sType =
          typeof p.start_age === "number" ? "year" : p.start_age.type;
        const eAge = typeof p.end_age === "number" ? p.end_age : p.end_age.age;
        const eType = typeof p.end_age === "number" ? "year" : p.end_age.type;
        const rangeKey = `${sAge}_${sType}_${eAge}_${eType}`;
        if (!filters.ages.includes(rangeKey)) return false;
      }

      return true;
    });
  }, [allPlans, filters]);

  const getDurationLabel = (count: number, type: string) => {
    const unitLabel =
      tCommon(`units.${count === 1 ? type : type + "s"}`) || type;
    return `${count} ${unitLabel}`;
  };

  const selectedProgram = filteredPrograms.find(
    (p) => String(p.id) === selectedProgramId,
  );

  const handleBooking = () => {
    if (selectedProgram) {
      // Find which branch this program belongs to (might need improved logic if programs are shared)
      const branchId = filters.branches[0] || activeBranchIds[0];
      window.location.href = `/${locale}/nurseries/${nurseryName}/reservation?branch=${branchId}&plan=${selectedProgram.id}`;
    }
  };

  return (
    <section id="programs" className="scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className="w-12 h-12 rounded-xl border-gray-100 shadow-sm hover:bg-gray-50 bg-white"
        >
          <SlidersHorizontal className="w-6 h-6 text-gray-400" />
        </Button>

        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3A82]">
            {t("title")}{" "}
            <span className="text-gray-400 font-medium">
              {t("count", { count: filteredPrograms.length })}
            </span>
          </h2>
          <div className="w-1.5 h-8 bg-[#2D3A82] rounded-full" />
        </div>
      </div>

      <div className="bg-[#F8F9FC] rounded-[40px] p-6 shadow-sm border border-gray-50 flex flex-col gap-6">
        {/* Programs List - Optimized to show ~5 items with scrollbar */}
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
          {loadingPlans || loadingBranches ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-[24px] flex justify-between items-center animate-pulse"
              >
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-40" />
              </div>
            ))
          ) : filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                title={program.title}
                durationLabel={getDurationLabel(
                  program.count,
                  program.enrollment_type,
                )}
                price={program.price_amount}
                isSelected={String(program.id) === selectedProgramId}
                onClick={() => setSelectedProgramId(String(program.id))}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-[24px] border border-dashed border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">{t("noResults")}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleBooking}
          disabled={!selectedProgramId}
          className="w-full h-16 rounded-[20px] bg-[linear-gradient(90deg,#7082FF_0%,#2D3A82_100%)] text-white text-xl font-bold hover:opacity-90 transition-opacity border-none shadow-[0_4px_14px_rgba(45,58,130,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("bookNow")}
        </Button>
      </div>

      {/* Filter Modal */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        branches={branches}
        programTypes={programTypes}
        ages={ageOptions}
        selectedFilters={filters}
        onApply={setFilters}
        onReset={() => setFilters({ branches: [], programTypes: [], ages: [] })}
      />
    </section>
  );
};

export default ProgramsSection;
