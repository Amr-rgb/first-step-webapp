"use client";

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
      <div className="flex gap-2 pb-2 w-max max-w-full">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === filter.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
