"use client";

import { useState } from "react";
import { DataTable } from "@/components/tables/DataTable";
import {
  useDiscountCodesColumns,
  DiscountCode,
  DiscountCodeStatus,
} from "@/components/tables/data/discount-codes";
import { Plus, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { FilterButtons } from "@/components/common/FilterButtons";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API call
const mockDiscountCodes: DiscountCode[] = [
  {
    id: "1",
    code: "Night10",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 15,
    usedCount: 3,
    pendingUsage: 2,
    discountPercentage: 10,
    discountValue: 150,
    status: "active",
  },
  {
    id: "2",
    code: "BB40",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 100,
    usedCount: 11,
    pendingUsage: 5,
    discountPercentage: 10,
    discountValue: 100,
    status: "notStarted",
  },
  {
    id: "3",
    code: "HA12",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 156,
    usedCount: 42,
    pendingUsage: 8,
    discountPercentage: 10,
    discountValue: 120,
    status: "paused",
  },
  {
    id: "4",
    code: "HH15",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 42,
    usedCount: 7,
    pendingUsage: 1,
    discountPercentage: 10,
    discountValue: 54,
    status: "expired",
  },
  {
    id: "5",
    code: "ME15",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 333,
    usedCount: 56,
    pendingUsage: 12,
    discountPercentage: 10,
    discountValue: 33,
    status: "notStarted",
  },
  {
    id: "6",
    code: "BF10",
    startDate: "8 / 8 / 2025",
    endDate: "8 / 8 / 2025",
    usageLimit: 66,
    usedCount: 22,
    pendingUsage: 4,
    discountPercentage: 10,
    discountValue: 45,
    status: "active",
  },
];

type FilterStatus = "all" | DiscountCodeStatus;

export default function DiscountCodes() {
  const t = useTranslations("discountCodes");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const columns = useDiscountCodesColumns();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filterCounts = {
    all: mockDiscountCodes.length,
    active: mockDiscountCodes.filter((code) => code.status === "active").length,
    notStarted: mockDiscountCodes.filter((code) => code.status === "notStarted")
      .length,
    paused: mockDiscountCodes.filter((code) => code.status === "paused").length,
    expired: mockDiscountCodes.filter((code) => code.status === "expired")
      .length,
  };

  const filteredData = mockDiscountCodes.filter((code) => {
    const matchesSearch = code.code
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || code.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { value: "all" as const, label: t("filters.all") },
    { value: "active" as const, label: t("filters.active") },
    { value: "notStarted" as const, label: t("filters.notStarted") },
    { value: "paused" as const, label: t("filters.paused") },
    { value: "expired" as const, label: t("filters.expired") },
  ];

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
            // Handle add discount code
            console.log("Add discount code");
          }}
        >
          <Plus className="w-5 h-5" />
          <span>{t("addButton")}</span>
        </Button>

        <div className="relative w-full sm:w-96">
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
    </div>
  );
}
