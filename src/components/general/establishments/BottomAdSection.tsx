"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AdPlaceholder from "./AdPlaceholder";

const BottomAdSection = () => {
  const t = useTranslations("adSection");

  return (
    <section className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-[1320px] mx-auto">
          {/* Title with left border (RTL) */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-primary font-tajawal leading-none">
              {t("title")}
            </h2>
          </div>
          
          {/* Grid Layout */}
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Right Column (RTL) - Single large ad */}
            <div className="w-full lg:w-1/2">
              <AdPlaceholder variant="bottom-large" className="w-full h-full" />
            </div>
            
            {/* Left Column (RTL) - Two stacked ads */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <AdPlaceholder variant="bottom-medium" className="w-full flex-1" />
              <AdPlaceholder variant="bottom-small" className="w-full flex-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomAdSection;
