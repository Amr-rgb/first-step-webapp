"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import FilterButtons from "../search/FilterButtons";
import NurseryCard from "./NurseryCard";
import { NurseryResponse } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";

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
  locale: string;
  error?: any;
}) => {
  const t = useTranslations("nurseries");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedFilter, setSelectedFilter] = useState(filter);

  const debouncedQuery = useDebounce(searchQuery, 500);

  // Update URL when search or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (selectedFilter) params.set("filter", selectedFilter);
    router.push(`/nurseries?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, selectedFilter]);

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
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 xl:px-24">
          {filteredNurseries.map((nursery, index) => (
            <NurseryCard nursery={nursery} locale={locale} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Nurseries;
