"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActivitiesProps {
  title?: string;
  subtitle?: string;
  activities: string[];
  buttonText?: string;
  preview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Activities = ({
  title,
  subtitle,
  activities,
  buttonText,
  preview = false,
  locale,
  nurseryName,
}: ActivitiesProps) => {
  const t = useTranslations("nurseryDetails");

  // Don't render if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  // Create 6 slots - fill with images or placeholder loaders
  const createImageSlot = (index: number, height: string) => {
    const imageUrl = activities[index];

    if (imageUrl) {
      return (
        <img
          key={index}
          src={imageUrl}
          alt={`activity${index + 1}`}
          className={`rounded-2xl object-cover w-full ${height}`}
        />
      );
    } else {
      return (
        <div
          key={index}
          className={`rounded-2xl w-full ${height} bg-gray-100 flex items-center justify-center`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#6A8DFF] border-t-transparent"></div>
            <span className="text-[#22336C] text-sm font-medium">
              Loading...
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <section className="mt-20 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
        {t("activities.title")}
      </h2>
      <div className="text-center text-[#22336C] mb-8 font-medium">
        {subtitle || t("activities.description")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12 mb-8">
        {/* Column 1 - Small first, Tall second */}
        <div className="flex flex-col gap-4">
          {createImageSlot(0, "h-48")}
          {createImageSlot(1, "h-80")}
        </div>

        {/* Column 2 - Tall first, Small second (opposite design) */}
        <div className="flex flex-col gap-4">
          {createImageSlot(2, "h-80")}
          {createImageSlot(3, "h-48")}
        </div>

        {/* Column 3 - Small first, Tall second (same as column 1) */}
        <div className="flex flex-col gap-4">
          {createImageSlot(4, "h-48")}
          {createImageSlot(5, "h-80")}
        </div>
      </div>

      {buttonText && (
        <div className="flex justify-center mb-12">
          <div className="relative group">
            <button className="bg-gray-400 text-white rounded-xl px-12 py-4 font-bold text-lg shadow-lg opacity-50">
              {buttonText}
            </button>
            {!preview ? (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Wait until the nursery adds its plans or programs
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;
