"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, DollarSign, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { nurseryService } from "@/services/api";

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
}

const Plans = ({ nurseryName, locale }: PlansProps) => {
  const t = useTranslations("nurseryDetails");
  const [selectedBranch, setSelectedBranch] = useState<null | {
    id: string;
    name: string;
  }>(null);

  // Resolve center ID by nursery name
  const { data: nurseries = [] } = useQuery({
    queryKey: ["nurseries-for-center-id", locale],
    queryFn: () => nurseryService.getNurseries(locale),
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
    queryFn: () => nurseryService.getBranchesForCenter(centerId as string),
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
      nurseryService.getBranchPricing(
        selectedBranch?.id as string,
        centerId as string
      ),
    enabled: !!selectedBranch && !!centerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    !selectedBranch &&
      branches.length > 0 &&
      setSelectedBranch({ id: branches[0].id, name: branches[0].name });
  }, [branches]);

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

  // Don't render if no branches found
  if (!branches || branches.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("plans.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("plans.subtitle")}
          </p>
        </div>

        {/* Branch Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <MapPin className="w-5 h-5 text-blue-600" />
              <Select
                value={selectedBranch?.id}
                onValueChange={(value) => {
                  const branch = branches.find((b) => b.id === value);
                  if (branch) {
                    setSelectedBranch({ id: branch.id, name: branch.name });
                  }
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder={t("plans.selectBranch")} />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch, index: number) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                      {index === 0 && (
                        <span className="ml-2 text-xs text-blue-600">
                          {locale === "ar"
                            ? "(الفرع الرئيسي)"
                            : "(Main Branch)"}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBranchData && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">{selectedBranchData.name}</p>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {loadingPlans ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: Plan) => (
              <Card
                key={plan.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  {/* Program Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {plan.title}
                  </h3>

                  {/* Program Details */}
                  <div className="space-y-3 mb-6">
                    {/* Age Range */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {t("plans.ageRange")}: {plan.start_age}-{plan.end_age}{" "}
                        {locale === "ar" ? "سنة" : "years"}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        {t("plans.duration")}:{" "}
                        {getDurationLabel(plan.count, plan.enrollment_type)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        {t("plans.price")}: {plan.price_amount}{" "}
                        {locale === "ar" ? "ريال" : "SAR"}
                      </span>
                    </div>
                  </div>

                  {/* Booking Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      // Navigate to booking page with plan details
                      window.location.href = `/${locale}/nurseries/${nurseryName}/reservation?branch=${selectedBranch?.id}&plan=${plan.id}`;
                    }}
                  >
                    {t("plans.bookNow")}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                  ? "سيتم إضافة البرامج قريباً. تحقق من الفرع لاحقاً."
                  : "Programs will be added soon. Please check back later."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
