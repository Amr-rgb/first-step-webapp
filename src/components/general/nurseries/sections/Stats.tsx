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
  preview?: boolean;
  locale?: string;
  nurseryName?: string;
}

const Stats = ({
  stats,
  buttonText,
  preview = false,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="mb-6">{stat.icon}</div>
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
