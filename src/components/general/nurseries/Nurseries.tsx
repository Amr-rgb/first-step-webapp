"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import FilterButtons from "../search/FilterButtons";
import NurseryCard from "./NurseryCard";
import { NurseryResponse } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

const Nurseries = ({
  nurseries,
  query,
  filter,
  locale,
}: {
  nurseries: NurseryResponse[];
  query: string;
  filter: string;
  locale: string;
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

  // Filter data
  const filteredNurseries = nurseries.filter((nursery) => {
    const matchesQuery = nursery.nursery_name
      .toLocaleLowerCase()
      .includes(debouncedQuery.toLocaleLowerCase());
    const matchesFilter = selectedFilter
      ? nursery.accepted_ages.includes(selectedFilter)
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
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 xl:px-24">
        {filteredNurseries.map((nursery, index) => (
          <NurseryCard nursery={nursery} locale={locale} key={index} />
        ))}
      </div>
    </section>
  );
};

export default Nurseries;
