"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/tables/DataTable";
import {
  useDiscountCodesColumns,
  DiscountCode,
  DiscountCodeStatus,
} from "@/components/tables/data/discount-codes";
import { Plus, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { FilterButtons } from "@/components/common/FilterButtons";
import CreatePromocodeModal from "./CreatePromocodeModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/promocodeService";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type FilterStatus = "all" | DiscountCodeStatus;

// Helper function to map API status to our status type
const mapApiStatus = (status: string): DiscountCodeStatus => {
  const statusMap: Record<string, DiscountCodeStatus> = {
    active: "active",
    inactive: "paused",
    expired: "expired",
    not_started: "notStarted",
  };
  return statusMap[status] || "active";
};

export default function DiscountCodes() {
  const t = useTranslations("discountCodes");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedPromocodeId, setSelectedPromocodeId] = useState<string | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleEdit = (id: string) => {
    setSelectedPromocodeId(id);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (id: string) => {
    setSelectedPromocodeId(id);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const columns = useDiscountCodesColumns({
    onEdit: handleEdit,
    onView: handleView,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromocodeId(null);
  };

  // Fetch promocodes from API
  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promocodes"],
    queryFn: adminService.getPromocodes,
  });

  // Transform API data to match our DiscountCode type
  const discountCodes: DiscountCode[] = useMemo(() => {
    // API returns array directly
    if (!apiData) return [];

    const promos = Array.isArray(apiData.data) ? apiData.data : [];

    return promos.map((promo: any) => ({
      id: promo.id.toString(),
      code: promo.title,
      startDate: promo.start_date
        ? format(new Date(promo.start_date), "dd / MM / yyyy")
        : "",
      endDate: promo.end_date
        ? format(new Date(promo.end_date), "dd / MM / yyyy")
        : "",
      usageLimit: promo.max_number_of_usage || 0,
      discountPercentage: parseFloat(promo.percentage) || 0,
      discountValue: promo.amount ? parseFloat(promo.amount) : 0,
      status: mapApiStatus(promo.status),
    }));
  }, [apiData]);

  const filterCounts = useMemo(
    () => ({
      all: discountCodes.length,
      active: discountCodes.filter((code) => code.status === "active").length,
      notStarted: discountCodes.filter((code) => code.status === "notStarted")
        .length,
      paused: discountCodes.filter((code) => code.status === "paused").length,
      expired: discountCodes.filter((code) => code.status === "expired").length,
    }),
    [discountCodes]
  );

  const filteredData = useMemo(() => {
    return discountCodes.filter((code) => {
      const matchesSearch = code.code
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || code.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [discountCodes, searchQuery, activeFilter]);

  const filters = [
    { value: "all" as const, label: t("filters.all") },
    { value: "active" as const, label: t("filters.active") },
    { value: "notStarted" as const, label: t("filters.notStarted") },
    { value: "paused" as const, label: t("filters.paused") },
    { value: "expired" as const, label: t("filters.expired") },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filter Buttons Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Search and Add Button Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-12 w-full sm:w-96 rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 flex justify-center pb-4">
            <Skeleton className="h-7 w-32" />
          </div>
          <div className="border rounded-md">
            <div className="border-b p-4 bg-gray-50/50">
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600">
            {t("error") || "Error loading discount codes"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <FilterButtons
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            setSelectedPromocodeId(null);
            setIsViewMode(false);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          <span>{t("addButton")}</span>
        </Button>

        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 ${
              isRTL ? "pr-12 text-right" : "pl-12 text-left"
            } rounded-lg border border-gray-200 `}
          />
          <Search
            className={`absolute ${
              isRTL ? "right-4" : "left-4"
            } top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border-b border-gray-200 flex justify-center">
        <h2 className={`text-lg font-semibold`}>{t("title")}</h2>
      </div>

      <DataTable columns={columns} data={filteredData} pagination />

      {/* Create Promocode Modal */}
      <CreatePromocodeModal
        key={selectedPromocodeId || "create"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promocodeId={selectedPromocodeId}
        isViewMode={isViewMode}
        onSwitchToEdit={() => setIsViewMode(false)}
      />
    </div>
  );
}
