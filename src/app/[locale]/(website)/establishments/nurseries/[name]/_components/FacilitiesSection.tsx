"use client";

import Image from "next/image";
import { SectionHeader } from "../../../_components";
import { AdminOption } from "@/types";

interface FacilitiesSectionProps {
  title: string;
  facilities: AdminOption[];
  locale: string;
}

const FacilitiesSection = ({
  title,
  facilities,
  locale,
}: FacilitiesSectionProps) => {
  if (!facilities || facilities.length === 0) return null;

  return (
    <section id="facilities" className="py-0 scroll-mt-20">
      <SectionHeader title={title} />
      <div className="bg-white-out p-4 rounded-2xl flex flex-wrap items-center justify-center gap-x-4 gap-y-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-xl px-4 py-2 flex flex-col gap-2 min-w-[180px] grow"
          >
            <div className="relative w-12 h-12 md:w-15 md:h-15">
              <Image
                src={facility.image}
                alt={
                  typeof facility.title === "string"
                    ? facility.title
                    : facility.title[locale as "en" | "ar"] || facility.title.ar
                }
                fill
                className="object-contain"
              />
            </div>
            <h4 className="heading-4 font-bold text-primary leading-tight">
              {typeof facility.title === "string"
                ? facility.title
                : facility.title[locale as "en" | "ar"] || facility.title.ar}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacilitiesSection;
