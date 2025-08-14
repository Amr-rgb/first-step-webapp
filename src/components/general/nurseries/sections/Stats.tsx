"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface Stat {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

interface StatsProps {
  stats: Stat[];
  buttonText?: string;
  isPreview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Stats = ({
  stats,
  buttonText,
  isPreview = false,
  locale,
  nurseryName,
}: StatsProps) => {
  const t = useTranslations("nurseryDetails");

  // Don't render if no stats
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 mb-10">
      {buttonText && (
        <div className="flex justify-center mb-8">
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
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className={`${stat.color} font-bold mt-1`}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
