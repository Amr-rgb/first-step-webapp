"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getNurseriesAction,
  getBranchesForCenterAction,
  getBranchPricingAction,
} from "@/actions/nurseryActions";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanCard } from "@/components/common/PlanCard";

interface Plan {
  id: number;
  title: string;
  enrollment_type: string;
  start_age: number;
  end_age: number;
  count: number;
  price_amount: string;
}

interface PlansProps {
  nurseryName: string;
  locale: string;
  preview?: boolean;
}

const Plans = ({ nurseryName, locale, preview }: PlansProps) => {
  const t = useTranslations("nurseryDetails");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  const [selectedBranch, setSelectedBranch] = useState<null | {
    id: string;
    name: string;
  }>(null);

  // Initialize state from URL or default to 'all'
  const [selectedEnrollmentType, setSelectedEnrollmentType] = useState<string>(
    searchParams.get("type") || "all"
  );
  const [selectedAge, setSelectedAge] = useState<string>(
    searchParams.get("age") || "all"
  );

  // Resolve center ID by nursery name
  const { data: nurseries = [] } = useQuery({
    queryKey: ["nurseries-for-center-id", locale],
    queryFn: () => getNurseriesAction(locale),
    enabled: !!locale,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const centerId: string | undefined = (() => {
    if (!nurseries || nurseries.length === 0) return undefined;
    const target = nurseries.find((n: any) => {
      const dbName = (n.nursery_name || n.name || "").toLowerCase().trim();
      const searchName = (nurseryName || "").toLowerCase().trim();
      return (
        dbName === searchName ||
        dbName.includes(searchName) ||
        searchName.includes(dbName)
      );
    });
    return target?.id ? String(target.id) : undefined;
  })();

  // Fetch branches for center
  const {
    data: branchesResponse,
    isLoading: loadingBranches,
    error: branchesError,
  } = useQuery({
    queryKey: ["branches-for-center", centerId],
    queryFn: () => getBranchesForCenterAction(centerId as string),
    enabled: !!centerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const branches: Array<{ id: string; name: string; pricing?: any[] }> =
    branchesResponse?.data?.map((b: any) => ({
      id: String(b.id),
      name: b.nursery_name || b.name || "Branch",
      pricing: b.pricing,
    })) || [];

  // Fetch plans for selected branch using React Query
  const {
    data: plans = [],
    isLoading: loadingPlans,
    error: plansError,
  } = useQuery({
    queryKey: ["branch-pricing", selectedBranch?.id, centerId],
    queryFn: () =>
      getBranchPricingAction(selectedBranch?.id as string, centerId as string),
    enabled: !!selectedBranch && !!centerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle Initial Branch Selection (from URL or Default) - only once
  useEffect(() => {
    if (branches.length > 0 && !hasInitialized.current) {
      const paramBranchId = searchParams.get("branch");
      if (paramBranchId) {
        const foundBranch = branches.find((b) => b.id === paramBranchId);
        if (foundBranch) {
          setSelectedBranch({ id: foundBranch.id, name: foundBranch.name });
          hasInitialized.current = true;
          return;
        }
      }
      // Fallback: default to first branch
      setSelectedBranch({ id: branches[0].id, name: branches[0].name });
      hasInitialized.current = true;
    }
  }, [branches, searchParams]);

  // Sync URL when filters change
  useEffect(() => {
    if (preview || !hasInitialized.current) return;

    const params = new URLSearchParams();

    // Sync Branch
    if (selectedBranch?.id) {
      params.set("branch", selectedBranch.id);
    }

    // Sync Enrollment Type
    if (selectedEnrollmentType && selectedEnrollmentType !== "all") {
      params.set("type", selectedEnrollmentType);
    }

    // Sync Age
    if (selectedAge && selectedAge !== "all") {
      params.set("age", selectedAge);
    }

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }
  }, [
    selectedBranch,
    selectedEnrollmentType,
    selectedAge,
    pathname,
    router,
    searchParams,
    preview,
  ]);
  const getEnrollmentTypeLabel = (type: string) => {
    switch (type) {
      case "hour":
        return locale === "ar" ? "ساعة" : "Hour";
      case "day":
        return locale === "ar" ? "يوم" : "Day";
      case "month":
        return locale === "ar" ? "شهر" : "Month";
      case "year":
        return locale === "ar" ? "سنة" : "Year";
      default:
        return type;
    }
  };

  const getDurationLabel = (count: number, type: string) => {
    const typeLabel = getEnrollmentTypeLabel(type);
    if (count === 1) {
      return typeLabel;
    }
    return `${count} ${typeLabel}${
      locale === "ar" ? "ات" : count > 1 ? "s" : ""
    }`;
  };

  const selectedBranchData = branches?.find(
    (branch) => branch.id === selectedBranch?.id
  );

  // Show placeholder in preview mode if no branches found
  if (preview && (!branches || branches.length === 0)) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("plans.title")}
            </h2>
          </div>

          {/* Preview Placeholder */}
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {locale === "ar" ? "معاينة البرامج" : "Programs Preview"}
              </h3>
              <p className="text-gray-600">
                {locale === "ar"
                  ? "ستظهر البرامج هنا عند إضافة الفروع والخطط"
                  : "Programs will appear here when branches and plans are added"}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter Logic
  const filteredPlans = useMemo(() => {
    let result = plans;

    if (selectedEnrollmentType && selectedEnrollmentType !== "all") {
      result = result.filter(
        (p) => p.enrollment_type === selectedEnrollmentType
      );
    }

    if (selectedAge && selectedAge !== "all") {
      const [minStr, maxStr] = selectedAge.split("_");
      const minAge = parseInt(minStr);
      const maxAge = parseInt(maxStr);

      // Match plans that overlap with the selected range
      result = result.filter((p) => {
        // Check for overlap: plan starts before selection ends AND plan ends after selection starts
        return p.start_age <= maxAge && p.end_age >= minAge;
        // Or simpler exact match if that is the intent?
        // The user said "ages to be taken from the plans itself", so likely exact ranges.
        // Let's assume we want to show plans that match these specific start/end ages.
        // return p.start_age === minAge && p.end_age === maxAge;
      });
      // Actually strictly filtering by equality of the range is usually what "taken from plan" implies for filters
      result = result.filter(
        (p) => p.start_age === minAge && p.end_age === maxAge
      );
    }

    return result;
  }, [plans, selectedEnrollmentType, selectedAge]);

  const availableEnrollmentTypes = useMemo(() => {
    return Array.from(new Set(plans.map((p) => p.enrollment_type)));
  }, [plans]);

  // Generate unique age options from plans
  const ageOptions = useMemo(() => {
    // group by start_age and end_age
    const ranges = new Set<string>();
    plans.forEach((p) => {
      ranges.add(`${p.start_age}_${p.end_age}`);
    });

    return Array.from(ranges)
      .map((range) => {
        const [start, end] = range.split("_");
        return {
          value: range,
          label:
            locale === "ar"
              ? `من ${start} سنوات ل ${end} سنوات`
              : `From ${start} to ${end} years`, // Adjusted English label
        };
      })
      .sort((a, b) => {
        const startA = parseInt(a.value.split("_")[0]);
        const startB = parseInt(b.value.split("_")[0]);
        return startA - startB;
      });
  }, [plans, locale]);

  return (
    <section id="plans-section" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("plans.title")}
          </h2>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Branch Selector */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-[200px]">
            <Select
              value={selectedBranch?.id}
              onValueChange={(value) => {
                const branch = branches.find((b) => b.id === value);
                if (branch) {
                  setSelectedBranch({ id: branch.id, name: branch.name });
                  setSelectedEnrollmentType("all");
                  setSelectedAge("all");
                }
              }}
              disabled={loadingBranches || branches.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingBranches ? "Loading..." : t("plans.selectBranch")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch, index: number) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                    {index === 0 && (
                      <span className="ml-2 text-xs text-primary">
                        {locale === "ar" ? "(الفرع الرئيسي)" : "(Main Branch)"}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enrollment Type Selector (Buttons) */}
          <div className="flex flex-wrap justify-center gap-2">
            {availableEnrollmentTypes.map((type) => (
              <Button
                key={type}
                variant={
                  selectedEnrollmentType === type ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedEnrollmentType(
                    selectedEnrollmentType === type ? "all" : type
                  )
                }
                className={
                  selectedEnrollmentType === type
                    ? ""
                    : "!border-mid-gray !text-mid-gray"
                }
              >
                {getEnrollmentTypeLabel(type)}
              </Button>
            ))}
          </div>

          {/* Age Selector */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-[200px]">
            <Select
              value={selectedAge}
              onValueChange={setSelectedAge}
              disabled={loadingPlans || plans.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("plans.selectAge")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === "ar" ? "الكل" : "All"}
                </SelectItem>
                {ageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plans Grid */}
        {loadingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPlans.map((plan: Plan) => (
                <PlanCard
                  key={plan.id}
                  title={plan.title}
                  durationLabel={getDurationLabel(
                    plan.count,
                    plan.enrollment_type
                  )}
                  price={plan.price_amount}
                  className="hover:shadow-lg transition-shadow duration-300 hover:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))]"
                >
                  <div className="space-y-4 pt-2">
                    {/* Age Range */}
                    <p className="text-sm text-gray-600">
                      {t("plans.ageRange")}: {plan.start_age}-{plan.end_age}{" "}
                      {locale === "ar" ? "سنة" : "years"}
                    </p>

                    {/* Booking Button */}
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        if (!preview) {
                          // Navigate to booking page with plan details
                          window.location.href = `/${locale}/nurseries/${nurseryName}/reservation?branch=${selectedBranch?.id}&plan=${plan.id}`;
                        }
                      }}
                    >
                      {t("plans.bookNow")}
                    </Button>
                  </div>
                </PlanCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {locale === "ar"
                  ? "لا توجد برامج متاحة حالياً"
                  : "No Programs Available"}
              </h3>
              <p className="text-gray-600">
                {locale === "ar"
                  ? "يرجى تغيير خيارات التصفية أو التحقق من الفرع لاحقاً."
                  : "Please change filter options or check back later."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
