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
    <section className="mt-20 mb-16 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {buttonText && (
          <div className="flex justify-center mb-12">
            {isPreview ? (
              <button className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-xl px-12 py-4 font-bold text-lg shadow-lg hover:opacity-90 transition transform hover:scale-105">
                {buttonText}
              </button>
            ) : (
              <Link
                href={`/${locale}/nurseries/${nurseryName}/reservation`}
                className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-xl px-12 py-4 font-bold text-lg shadow-lg hover:opacity-90 transition transform hover:scale-105"
              >
                {buttonText}
              </Link>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div
                className={`text-5xl md:text-6xl font-bold ${stat.color} mb-3`}
              >
                {stat.value}
              </div>
              <div className={`${stat.color} font-bold text-xl md:text-2xl`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
