"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AdPlaceholder from "./AdPlaceholder";

const TopAdSection = () => {
  const t = useTranslations("adSection");

  return (
    <section className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-9">
          <AdPlaceholder variant="top-left" className="w-full flex-1 min-h-[200px]" />
          <AdPlaceholder variant="top-right" className="w-full flex-1 min-h-[200px]" />
        </div>
      </div>
    </section>
  );
};

export default TopAdSection;
