"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Program {
  id: number;
  title: string;
  duration: string;
  price: number;
  age_group?: string;
  program_type?: string;
  branch_name?: string;
}

interface ProgramsProps {
  programs: Program[];
  isPreview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Programs = ({
  programs,
  isPreview = false,
  locale = "en",
  nurseryName = "",
}: ProgramsProps) => {
  const t = useTranslations("nurseryDetails");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Don't render if no programs
  if (!programs || programs.length === 0) {
    return null;
  }

  // Get unique filter options
  const ageGroups = [
    "all",
    ...Array.from(new Set(programs.map((p) => p.age_group).filter(Boolean))),
  ];
  const branches = [
    "all",
    ...Array.from(new Set(programs.map((p) => p.branch_name).filter(Boolean))),
  ];
  const programTypes = [
    "all",
    ...Array.from(new Set(programs.map((p) => p.program_type).filter(Boolean))),
  ];

  // Filter programs based on selected filters
  const filteredPrograms = programs.filter((program) => {
    if (selectedAge !== "all" && program.age_group !== selectedAge)
      return false;
    if (selectedBranch !== "all" && program.branch_name !== selectedBranch)
      return false;
    if (selectedType !== "all" && program.program_type !== selectedType)
      return false;
    return true;
  });

  return (
    <section className="mt-20 mb-10 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-8">
          {t("programs.title")}
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          {/* Child Age Filter */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {t("programs.filters.childAge")}
            </label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B12F53] focus:border-transparent"
            >
              {ageGroups.map((age) => (
                <option key={age} value={age}>
                  {age === "all" ? t("programs.filters.all") : age}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {t("programs.filters.branch")}
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B12F53] focus:border-transparent"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch === "all" ? t("programs.filters.all") : branch}
                </option>
              ))}
            </select>
          </div>

          {/* Program Type Filter */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {t("programs.filters.programType")}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B12F53] focus:border-transparent"
            >
              {programTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? t("programs.filters.all") : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              {/* Program Title */}
              <h3 className="text-xl font-bold text-[#B12F53] mb-3">
                {program.title}
              </h3>

              {/* Duration */}
              <p className="text-gray-600 text-sm mb-4">{program.duration}</p>

              {/* Price */}
              <div className="text-2xl font-bold text-[#22336C] mb-6">
                {program.price} {t("programs.currency")}
              </div>

              {/* Book Now Button */}
              <button
                className="w-full bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:opacity-90 transition transform hover:scale-105"
                onClick={() => {
                  if (!isPreview) {
                    // Navigate to booking page
                    window.location.href = `/${locale}/nurseries/${nurseryName}/reservation`;
                  }
                }}
              >
                {t("programs.bookNow")}
              </button>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("programs.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
