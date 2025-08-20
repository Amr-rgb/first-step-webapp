"use client";

import { useState } from "react";
import { Icons } from "../icons";
import Link from "next/link";
import Services from "./sections/Services";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { nurseryService } from "@/services/api";

interface Branch {
  id: number;
  name: string;
  nursery_name_branch: string;
  location: string;
  city?: {
    name: {
      en: string;
      ar: string;
    };
  };
}

interface BranchesProps {
  locale: string;
  nurseryName: string;
}

const Branches = ({ locale, nurseryName }: BranchesProps) => {
  const t = useTranslations("nurseryDetails");
  let services: { title: string; description: string; image: string }[] = [];

  const branchColors = [
    "text-[#B12F53] fill-[#B12F53]",
    "text-[#47B881] fill-[#47B881]",
    "text-[#3B82F6] fill-[#3B82F6]",
    "text-[#D9534F] fill-[#D9534F]",
    "text-[#FFAD0D] fill-[#FFAD0D]",
  ];

  // Fetch branches using React Query
  const {
    data: branches = [],
    isLoading: loadingBranches,
    error: branchesError,
  } = useQuery({
    queryKey: ["branches", nurseryName],
    queryFn: () => nurseryService.getBranchesByNursery(nurseryName),
    enabled: !!nurseryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch plans for all branches using React Query
  const branchPlansQueries = useQuery({
    queryKey: ["branch-plans", branches.map((b) => b.id)],
    queryFn: async () => {
      const plansPromises = branches.map(async (branch: Branch) => {
        try {
          const plans = await nurseryService.getBranchPricing(
            branch.id.toString()
          );
          return {
            branchId: branch.id,
            plans: plans || [],
          };
        } catch (error) {
          console.error(`Error fetching plans for branch ${branch.id}:`, error);
          return {
            branchId: branch.id,
            plans: [],
          };
        }
      });

      const plansResults = await Promise.all(plansPromises);
      const plansMap: { [key: number]: any[] } = {};
      plansResults.forEach((result) => {
        plansMap[result.branchId] = result.plans;
      });
      return plansMap;
    },
    enabled: branches.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const branchPlans = branchPlansQueries.data || {};
  const loading = loadingBranches || branchPlansQueries.isLoading;

  const isWorldOfLearningJunior = nurseryName
    .toLowerCase()
    .includes("world-of-learning-junior");

  if (loading) {
    return (
      <section className="my-10 container mx-auto px-4 xl:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  return (
    <>
      {/* Branches Section */}
      {!isWorldOfLearningJunior && (
        <section className="my-10 container mx-auto px-4 xl:px-8">
          <h2 className="mb-6 heading-3 text-secondary-burgundy text-center">
            {t("branches.title")}
          </h2>

          <div className="relative overflow-x-auto overflow-y-hidden px-4">
            <div className="flex flex-nowrap pb-4 min-h-[120px] justify-center">
              {branches.map((branch: Branch, index: number) => {
                const hasPlans =
                  branchPlans[branch.id] && branchPlans[branch.id].length > 0;
                const colorClass = branchColors[index % branchColors.length];

                return (
                  <div
                    key={branch.id}
                    className={`group relative flex flex-col items-center min-w-48 md:min-w-64 w-48 mb-8 ${colorClass}`}
                  >
                    <div className="-z-50 w-full h-1 bg-light-gray absolute translate-y-[670%] top-1/2 group-first:w-1/2 group-last:w-1/2 group-first:right-0 group-last:left-0 rtl:group-last:right-0 rtl:group-first:right-auto rtl:group-first:left-0" />

                    {/* Branch circle with color based on index */}
                    <div
                      className={
                        "rounded-full flex items-center justify-center origin-[50%_80%] group-even:rotate-180"
                      }
                    >
                      <Icons.location className="fill-inherit size-20" />
                    </div>

                    {/* Branch name */}
                    <p className="absolute left-1/2 -translate-x-1/2 group-even:top-[20%] group-odd:top-[100%] text-2xl text-center font-bold text-nowrap whitespace-nowrap">
                      {branch.nursery_name_branch || branch.name}
                    </p>

                    {/* Booking Button - Only show if branch has plans */}
                    {hasPlans && (
                      <div className="absolute left-1/2 -translate-x-1/2 group-even:bottom-[20%] group-odd:bottom-[100%] mt-4">
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                          onClick={() => {
                            window.location.href = `/${locale}/nurseries/${nurseryName}/reservation?branch=${branch.id}`;
                          }}
                        >
                          {locale === "ar" ? "احجز الآن" : "Book Now"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Nursery Services Section */}
      {services.length > 0 && <Services services={services} />}
    </>
  );
};

export default Branches;
