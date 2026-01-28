"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import FilterButtons from "../search/FilterButtons";
import NurseryCard from "./NurseryCard";
import { NurseryResponse } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";

type LocaleKey = "ar" | "en";

const Nurseries = ({
  nurseries,
  query,
  filter,
  locale,
  error,
}: {
  nurseries: NurseryResponse[];
  query: string;
  filter: string;
  locale: LocaleKey;
  error?: any;
}) => {
  // Log the response data
  console.log("=== NURSERIES PAGE DATA ===");
  console.log("Nurseries data:", nurseries);
  console.log("Nurseries count:", nurseries?.length || 0);
  console.log("Query:", query);
  console.log("Filter:", filter);
  console.log("Locale:", locale);
  console.log("Error:", error);
  console.log("=== END NURSERIES DATA ===");

  const t = useTranslations("nurseries");
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedFilter, setSelectedFilter] = useState(filter);

  const debouncedQuery = useDebounce(searchQuery, 500);

  // Update URL when search or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (selectedFilter) params.set("filter", selectedFilter);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, selectedFilter, pathname]);

  const handleRetry = () => {
    router.refresh();
  };

  // Filter data
  const filteredNurseries = nurseries.filter((nursery) => {
    const matchesQuery = nursery.nursery_name
      .toLocaleLowerCase()
      .includes(debouncedQuery.toLocaleLowerCase());
    const matchesFilter = selectedFilter
      ? nursery.accepted_ages?.includes(selectedFilter) || false
      : true;
    return matchesQuery && matchesFilter;
  });

  // Log filtered results
  console.log("=== FILTERING RESULTS ===");
  console.log("Search query:", debouncedQuery);
  console.log("Selected filter:", selectedFilter);
  console.log("Filtered nurseries count:", filteredNurseries.length);
  console.log("Filtered nurseries:", filteredNurseries);
  console.log("=== END FILTERING ===");

  return (
    <section className="container mx-auto px-4">
      <div>
        <SearchBar
          placeholder={t("search")}
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <FilterButtons selected={selectedFilter} onSelect={setSelectedFilter} />

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 mt-10">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-primary">
              {locale === "ar"
                ? "حدث خطأ في تحميل الحضانات"
                : "Error Loading Nurseries"}
            </h3>
            <p className="text-gray max-w-md">
              {error.isNetworkError
                ? locale === "ar"
                  ? "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
                  : "Please check your internet connection and try again"
                : error.message ||
                  (locale === "ar"
                    ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى"
                    : "An unexpected error occurred. Please try again")}
            </p>
          </div>
          <Button onClick={handleRetry} className="gap-2">
            <RotateCw className="w-4 h-4" />
            {locale === "ar" ? "إعادة المحاولة" : "Retry"}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!error && filteredNurseries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 mt-10">
          <p className="text-gray text-lg">
            {locale === "ar"
              ? "لا توجد حضانات متاحة حالياً"
              : "No nurseries available at the moment"}
          </p>
        </div>
      )}

      {/* Nurseries Grid */}
      {!error && filteredNurseries.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:px-24">
          {filteredNurseries.map((nursery, index) => (
            <NurseryCard nursery={nursery} locale={locale} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Nurseries;
