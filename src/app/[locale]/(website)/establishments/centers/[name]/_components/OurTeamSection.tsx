"use client";

import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TeamMember {
  name: string;
  mission: string | null;
  image: string;
}

interface OurTeamSectionProps {
  teams: TeamMember[];
}

const OurTeamSection = ({ teams }: OurTeamSectionProps) => {
  const t = useTranslations("centerDetails.sections" as any);
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!teams || teams.length === 0) return null;

  return (
    <section id="our-team" className="py-0 scroll-mt-20">
      <Carousel
        opts={{
          align: "start",
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="heading-4 font-bold text-primary">{t("ourTeam")}</h2>
          </div>

          <div className="flex items-center gap-2">
            <CarouselPrevious
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
            <CarouselNext
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
          </div>
        </div>

        <div className="bg-white-out p-4 rounded-2xl">
          <CarouselContent className="-ml-4">
            {teams.map((member, index) => {
              // Alternate between gradient and primary color
              const isGradient = index % 2 === 0;

              return (
                <CarouselItem key={index} className="pl-4 basis-1/2">
                  <div
                    className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl aspect-232/285"
                    style={{
                      width: "100%",
                      margin: "0 auto",
                      background: isGradient
                        ? "linear-gradient(98.52deg, #7A8CFD 11.17%, #404FB1 63.74%, #2B3990 94.71%)"
                        : "#2B3990",
                      borderRadius: 16,
                    }}
                  >
                    {/* Member Image - Full Height */}
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Floating Name Card at bottom */}
                    <div className="relative z-10 bg-white rounded-xl shadow-md px-4 py-3 text-center w-[85%] mb-4 border border-gray-100/80 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <h4 className="font-bold text-xl leading-tight line-clamp-1">
                        {member.name}
                      </h4>
                      {member.mission && (
                        <p className="text-gray text-xs mt-0.5 line-clamp-1">
                          {member.mission}
                        </p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};

export default OurTeamSection;
