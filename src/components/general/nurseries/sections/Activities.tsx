"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface ActivitiesProps {
  title?: string;
  subtitle?: string;
  activities: string[];
  buttonText?: string;
  isPreview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Activities = ({
  title,
  subtitle,
  activities,
  buttonText,
  isPreview = false,
  locale,
  nurseryName,
}: ActivitiesProps) => {
  const t = useTranslations("nurseryDetails");

  // Don't render if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
        {title || t("activities.title")}
      </h2>
      <div className="text-center text-[#22336C] mb-8 font-medium">
        {subtitle || t("activities.description")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
        {activities.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`activity${idx + 1}`}
            className="rounded-2xl object-cover w-full h-64"
          />
        ))}
      </div>
      {buttonText && (
        <div className="flex justify-center">
          {isPreview ? (
            <button className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition">
              {buttonText}
            </button>
          ) : (
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation`}
              className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition"
            >
              {buttonText}
            </Link>
          )}
        </div>
      )}
    </section>
  );
};

export default Activities;
