"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../search/SearchBar";
import NurseryCard from "./NurseryCard";
import { EstablishmentResponse } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";
import FilterSidebar from "../establishments/FilterSidebar";

type LocaleKey = "ar" | "en";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterState {
  categories: string[];
  cities: string[];
  ages: string[];
  ratings: string[];
}

const Nurseries = ({
  nurseries,
  query,
  filter,
  locale,
  error,
  cities = [],
}: {
  nurseries: EstablishmentResponse[];
  query: string;
  filter: string;
  locale: LocaleKey;
  error?: any;
  cities?: FilterOption[];
}) => {
  const t = useTranslations("nurseries");
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    cities: [],
    ages: [],
    ratings: [],
  });

  const debouncedQuery = useDebounce(searchQuery, 500);

  const totalActiveFilters =
    filters.categories.length +
    filters.cities.length +
    filters.ages.length +
    filters.ratings.length;

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, pathname]);

  const handleRetry = () => {
    router.refresh();
  };

  // Advanced filtering logic
  const filteredNurseries = useMemo(() => {
    return nurseries.filter((nursery) => {
      // Search query filter
      const matchesQuery = nursery.nursery_name
        .toLocaleLowerCase()
        .includes(debouncedQuery.toLocaleLowerCase());

      if (!matchesQuery) return false;

      // City filter
      if (filters.cities.length > 0) {
        const nurseryCity =
          typeof nursery.city === "string"
            ? nursery.city
            : nursery.city?.name?.[locale] || "";
        const matchesCity = filters.cities.some(
          (cityId) =>
            nurseryCity.toLowerCase().includes(cityId.toLowerCase()) ||
            cityId.toLowerCase().includes(nurseryCity.toLowerCase()),
        );
        if (!matchesCity) return false;
      }

      // Age filter
      if (filters.ages.length > 0 && nursery.accepted_ages) {
        const matchesAge = filters.ages.some((ageFilter) => {
          // Map filter IDs to accepted_ages values
          const ageMapping: { [key: string]: string[] } = {
            infant: ["0-3"],
            "0-6-months": ["0-3"],
            "6-12-months": ["0-3"],
            "1-3-years": ["0-3"],
            "3-5-years": ["3-6"],
            "5-6-years": ["3-6"],
          };
          const mappedAges = ageMapping[ageFilter] || [];
          return mappedAges.some((age) => nursery.accepted_ages?.includes(age));
        });
        if (!matchesAge) return false;
      }

      // Category filter (placeholder - would need category data from API)
      // For now, we pass all nurseries through category filter

      return true;
    });
  }, [nurseries, debouncedQuery, filters, locale]);

  return (
    <section className="container mx-auto px-4">
      {/* Search Bar with Mobile Filter Button */}
      <div className="mb-6 flex gap-3 items-center">
        <div className="flex-1">
          <SearchBar
            placeholder={t("search")}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Mobile Filter Button */}
        <Button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 relative shrink-0"
        >
          <SlidersHorizontal className="w-6 h-6 text-white" />
          {totalActiveFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalActiveFilters}
            </span>
          )}
        </Button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          cities={cities}
          selectedFilters={filters}
          onFiltersChange={setFilters}
          locale={locale}
          isOpen={isMobileFilterOpen}
          onOpenChange={setIsMobileFilterOpen}
        />

        {/* Results Area */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-500">
            {locale === "ar"
              ? `${filteredNurseries.length} نتيجة`
              : `${filteredNurseries.length} results`}
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNurseries.map((nursery, index) => (
                <NurseryCard
                  nursery={{
                    ...nursery,
                  }}
                  locale={locale}
                  key={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Nurseries;
