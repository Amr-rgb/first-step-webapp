"use client";

import Image from "next/image";
import SectionHeader from "./SectionHeader";
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
    <section id="facilities" className="scroll-mt-20">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="group bg-white rounded-[40px] p-8 flex flex-col items-center justify-center gap-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100"
          >
            <div className="relative w-28 h-28 md:w-36 md:h-36 transition-transform group-hover:scale-110">
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
            <h4 className="text-2xl md:text-3xl font-bold text-[#2D3A82] leading-tight">
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
