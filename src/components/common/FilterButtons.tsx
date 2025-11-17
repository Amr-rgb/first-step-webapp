"use client";

import { Button } from "../ui/button";

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterButtonsProps<T extends string> {
  filters: FilterOption<T>[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
}

export function FilterButtons<T extends string>({
  filters,
  activeFilter,
  onFilterChange,
}: FilterButtonsProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 pb-2 w-6 max-w-full">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={activeFilter === filter.value ? "default" : "outline"}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
