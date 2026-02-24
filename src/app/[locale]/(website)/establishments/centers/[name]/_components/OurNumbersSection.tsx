"use client";

import React from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "../../../_components/SectionHeader";

interface Statistic {
    id: number;
    address: string;
    value: string;
}

interface NurseryState {
    class_rooms?: string;
    team_members?: string;
}

interface OurNumbersSectionProps {
    statistics: Statistic[];
    nurseryState?: NurseryState;
}

const OurNumbersSection = ({ statistics, nurseryState }: OurNumbersSectionProps) => {
    const t = useTranslations("centerDetails.stats" as any);

    // Combine statistics and nursery_state data
    const allStats = [];
    
    if (nurseryState?.class_rooms) {
        allStats.push({
            id: 'classrooms',
            value: nurseryState.class_rooms,
            label: t("classrooms")
        });
    }
    
    if (nurseryState?.team_members) {
        allStats.push({
            id: 'team',
            value: nurseryState.team_members,
            label: t("teamMembers")
        });
    }
    
    // Add custom statistics
    statistics.forEach((stat) => {
        allStats.push({
            id: stat.id,
            value: stat.value,
            label: stat.address
        });
    });

    if (allStats.length === 0) return null;

    return (
        <section id="our-numbers" className="py-0 scroll-mt-20">
            <div className="mb-8">
                <SectionHeader title={t("title")} />
            </div>

            <div className="bg-white-out p-4 rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                    {allStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-shadow hover:shadow-md"
                        >
                            <span className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                                {stat.value}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurNumbersSection;
