"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getBranchesForCenterAction,
  getBranchPricingAction,
} from "@/actions/nurseryActions";
import ProgramCard from "./ProgramCard";
import FilterDialog from "./FilterDialog";
import ReservationDialog from "./ReservationDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardIcons } from "@/components/general/icons";

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

  // Reservation dialog state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationBranch, setReservationBranch] = useState<string>("");
  const [reservationPlanId, setReservationPlanId] = useState<
    number | undefined
  >(undefined);

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

        // Convert everything to months for easier comparison
        const startInMonths = sType === "month" ? sAge : sAge * 12;
        const endInMonths = eType === "month" ? eAge : eAge * 12;

        const matchesAge = filters.ages.some((filterId) => {
          switch (filterId) {
            case "0_6_months":
              return startInMonths <= 6 && endInMonths >= 0;
            case "6_12_months":
              return startInMonths <= 12 && endInMonths >= 6;
            case "1_3_years":
              return startInMonths <= 36 && endInMonths >= 12;
            case "3_5_years":
              return startInMonths <= 60 && endInMonths >= 36;
            default:
              return false;
          }
        });

        if (!matchesAge) return false;
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
      // Find which branch this program belongs to
      const branchId = filters.branches[0] || activeBranchIds[0];
      setReservationBranch(branchId);
      setReservationPlanId(selectedProgram.id);
      setIsReservationOpen(true);
    }
  };

  return (
    <section id="programs" className="py-0 scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="heading-4 font-bold text-primary">
            {t("title")}{" "}
            <span className="text-gray-400 font-medium">
              {t("count", { count: filteredPrograms.length })}
            </span>
          </h2>
        </div>

        <button
          className="cursor-pointer text-primary"
          onClick={() => setIsFilterOpen(true)}
        >
          <dashboardIcons.multiFilter />
        </button>
      </div>

      <div className="bg-white-out rounded-2xl p-4 flex flex-col gap-6">
        {/* Programs List - Optimized to show ~5 items with scrollbar */}
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
          {loadingPlans || loadingBranches ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white px-4 py-4 rounded-2xl flex items-center justify-between gap-8 animate-pulse"
              >
                <Skeleton className="h-6 flex-1" />
                <div className="flex-1 flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
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
          size="long"
          onClick={handleBooking}
          disabled={!selectedProgramId}
          className="w-full! max-w-none"
        >
          {t("bookNow")}
        </Button>
      </div>

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        branches={branches}
        selectedFilters={filters}
        onApply={setFilters}
        onReset={() => setFilters({ branches: [], programTypes: [], ages: [] })}
      />

      <ReservationDialog
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        nurseryName={nurseryName}
        selectedBranch={reservationBranch}
        selectedPlanId={reservationPlanId}
        locale={locale as "ar" | "en"}
      />
    </section>
  );
};

export default ProgramsSection;
