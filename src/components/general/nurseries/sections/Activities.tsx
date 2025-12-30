"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActivitiesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  activities: string[];
  buttonText?: string;
  preview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Activities = ({
  title,
  subtitle,
  description,
  activities,
  buttonText,
  preview = false,
  locale,
  nurseryName,
}: ActivitiesProps) => {
  const t = useTranslations("nurseryDetails");

  // Show placeholder if no activities
  if (!activities || activities.length === 0) {
    return (
      <section className="mt-20 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
          {title || t("activities.title")}
        </h2>
        {(description || subtitle) && (
          <div className="text-center text-[#22336C] mb-8 font-medium">
            {description || subtitle}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-12 mb-8">
          {/* Show 6 placeholder slots */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`rounded-2xl w-full ${
                index % 3 === 1 ? "h-80" : "h-48"
              } bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
            >
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📸</div>
                <div className="text-sm">Add Activity Image</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
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
        <img
          key={index}
          src="/assets/illustrations/nursery_activity.png"
          alt={`activity${index + 1}`}
          className={`rounded-2xl object-cover w-full ${height}`}
        />
      );
    }
  };

  return (
    <section className="mt-20 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
        {t("activities.title")}
      </h2>
      {(description || subtitle) && (
        <div className="text-center text-[#22336C] mb-8 font-medium">
          {description || subtitle}
        </div>
      )}
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
    </section>
  );
};

export default Activities;
